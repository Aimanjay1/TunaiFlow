"use client"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/Toasts";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/components/UserProvider";
import { ClientSelectCombobox } from "@/components/ClientSelectCombobox";
import { toUtcIsoWithCurrentTime } from "@/utils/date";
import { useRouter } from "next/navigation";

function Cell({ children, className = "", ...rest }) {
    return (
        <TableCell {...rest} className={"align-center " + className}>
            {children}
        </TableCell>
    )
}

export default function AddInvoice() {
    const { open } = useToast();
    const router = useRouter()
    const form = useForm({
        defaultValues: {
            clientId: "",
            userId: "",
            orderDate: "",
            dueDate: "",
        },
        mode: "onChange",
    });

    // Items actually added
    const [items, setItems] = useState([]);

    // Draft item (input row)
    const [draft, setDraft] = useState({
        itemName: "",
        unitPrice: "",
        quantity: "1",
    });

    function resetDraft() {
        setDraft({ itemName: "", unitPrice: "", quantity: "1" });
    }

    function addDraftAsItem() {
        if (!draft.itemName.trim()) return;
        const unitPriceNum = Number(draft.unitPrice) || 0;
        const qtyNum = Number(draft.quantity) || 0;
        setItems(prev => [...prev, {
            itemName: draft.itemName.trim(),
            unitPrice: unitPriceNum,
            quantity: qtyNum || 1
        }]);
        resetDraft();
    }

    function removeItem(index) {
        setItems(prev => prev.filter((_, i) => i !== index));
    }

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0), 0),
        [items]
    );
    const taxRate = 0;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const { user } = useUser();

    async function handleSubmit() {
        const draftData = {
            clientId: Number(form.getValues("clientId")),
            userId: user.sub,
            orderDate: toUtcIsoWithCurrentTime(form.getValues("orderDate")),
            dueDate: toUtcIsoWithCurrentTime(form.getValues("dueDate")),
            items: items.map(i => ({
                itemName: i.itemName,
                unitPrice: Number(i.unitPrice) || 0,
                quantity: Number(i.quantity) || 0
            })),
        };
        try {
            const res = await fetch(`/api/invoices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(draftData),
            });
            const data = await res.json();
            if (!res.ok) {
                open(data.error || "Failed to create invoice", 4000);
            } else {
                open("Invoice created!", 3000);
                router.replace("/invoices")
                // Optionally reset form/items here
            }
        } catch (err) {
            open("Network error", 4000);
        }
    }

    return (
        <main className="flex flex-col h-min-full w-full p-4">
            <div className="container mx-auto my-12">
                <h1 className="text-5xl font-bold mb-4">Add New Invoice</h1>
                <p className="text-muted-foreground">Generate invoices with just a click of a button</p>
            </div>

            <div className="container mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-medium block mb-1">Client ID</label>
                        <ClientSelectCombobox
                            value={form.watch("clientId")}
                            onChange={val => form.setValue("clientId", val)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-1">Order Date</label>
                        <Input
                            type="date"
                            value={form.watch("orderDate")}
                            onChange={e => form.setValue("orderDate", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-1">Due Date</label>
                        <Input
                            type="date"
                            value={form.watch("dueDate")}
                            onChange={e => form.setValue("dueDate", e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold">Items</h2>
                        <Button
                            variant="secondary"
                            onClick={addDraftAsItem}
                            disabled={!draft.itemName.trim()}
                        >
                            Add Item
                        </Button>
                    </div>
                    <Table className="w-full table-fixed">
                        {/* Compact colgroup: only <col> elements, no whitespace text nodes */}
                        <colgroup><col /><col className="w-32" /><col className="w-28" /><col className="w-20" /><col className="w-28" /></colgroup>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead className="text-right pr-4">Total</TableHead>
                                <TableHead className="text-right pr-4">Line</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Draft input row */}
                            <TableRow className="bg-muted/30">
                                <Cell>
                                    <Input
                                        className={"bg-background"}
                                        placeholder="Item Name"
                                        value={draft.itemName}
                                        onChange={e => setDraft(d => ({ ...d, itemName: e.target.value }))}
                                    />
                                </Cell>
                                <Cell>
                                    <Input
                                        className={"bg-background"}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={draft.unitPrice}
                                        onChange={e => setDraft(d => ({ ...d, unitPrice: e.target.value }))}
                                    />
                                </Cell>
                                <Cell>
                                    <Input
                                        className={"bg-background"}
                                        type="number"
                                        step="1"
                                        min="1"
                                        placeholder="1"
                                        value={draft.quantity}
                                        onChange={e => setDraft(d => ({ ...d, quantity: e.target.value }))}
                                    />
                                </Cell>
                                <Cell>
                                </Cell>
                                <Cell className="text-right">
                                    <span className="text-xs text-muted-foreground">New</span>
                                </Cell>
                            </TableRow>

                            {/* Added items */}
                            {items.map((item, i) => {
                                const line = (item.unitPrice || 0) * (item.quantity || 0);
                                return (
                                    <TableRow key={i}>
                                        <Cell>{item.itemName}</Cell>
                                        <Cell>RM {item.unitPrice.toFixed(2)}</Cell>
                                        <Cell>{item.quantity}</Cell>
                                        <Cell>{
                                            <span className="tabular-nums">RM {line.toFixed(2)}</span>

                                        }</Cell>
                                        <Cell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => removeItem(i)}
                                                >
                                                    Del
                                                </Button>
                                            </div>
                                        </Cell>
                                    </TableRow>
                                )
                            })}

                            <TableRow>
                                <TableCell colSpan={5}>
                                    <div className="flex justify-between items-center py-2 border-t mt-2 text-sm">
                                        <div className="space-y-1">
                                            <p className="font-medium">Preview (live)</p>
                                            <p className="text-muted-foreground">Totals update as you edit.</p>
                                        </div>
                                        <div className="text-right space-y-0.5">
                                            <div>Subtotal: <span className="font-medium">RM {subtotal.toFixed(2)}</span></div>
                                            {taxRate > 0 && (
                                                <div>Tax ({(taxRate * 100).toFixed(0)}%): <span className="font-medium">RM {tax.toFixed(2)}</span></div>
                                            )}
                                            <div className="text-lg font-semibold">Total: RM {total.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="flex gap-4 justify-end">
                    <Button variant="outline" onClick={() => open("Canceled (no action)", 2500)}>Cancel</Button>
                    {/* <Button variant="secondary" onClick={handleSaveDraft}>Save Draft</Button> */}
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
            <Toaster />
        </main>
    )
}
