"use client"
import { useEffect, useState, useRef } from "react";
import { PageLayout, PageButton, TH, Cell } from "@/components/PageCommon";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import LoadingScreen from "@/components/loading-screen";

function ExpenseButton({ children, className, variant }) {
    variant = (variant ? "bg-" + variant : "bg-identity-dillute hover:bg-identity")
    className = variant + " " + (className || "")
    return (
        <Button className={className} >
            {children}
        </Button >
    )
}

export default function Expenses() {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [creating, setCreating] = useState(false)
    const [newExpense, setNewExpense] = useState({ description: "", amount: "", date: new Date().toISOString().slice(0, 10) })
    const creatingRowRef = useRef(null)

    useEffect(() => {
        let ignore = false
        async function load() {
            try {
                const res = await fetch("/api/expenses", { cache: "no-store" });
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (!ignore) setExpenses(data || []);
            } catch {
                if (!ignore) setError("Failed to load Expenses");
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true }
    }, [])

    if (loading) return <LoadingScreen />
    return (
        <PageLayout title="Expenses" subtitle="Generate Expenses with just a click of a button">
            <PageButton href="expenses/new">Add New Expense</PageButton>
            {

                !error ?
                    (<>
                        <Table className={"container mx-auto border-2 border-identity-dillute/20 rounded-xl "}>
                            <TableHeader >
                                <TableRow className={"bg-accent rounded-xl"}>
                                    <TH>Description</TH>
                                    <TH>Amount</TH>
                                    <TH>Date</TH>
                                    <TH>Actions</TH>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.map((exp) => (
                                    <TableRow key={exp.id || exp.expenseId || exp._tempId}>
                                        <Cell>{exp.description}</Cell>
                                        <Cell>{exp.amount}</Cell>
                                        <Cell>{new Date(exp.date).toLocaleDateString()}</Cell>
                                        <Cell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm">•••</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-32">
                                                    <DropdownMenuItem onClick={() => startEdit(exp)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem variant="destructive" onClick={() => handleDelete(exp)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </Cell>
                                    </TableRow>
                                ))}
                                {creating && (
                                    <TableRow ref={creatingRowRef} className="bg-muted/30">
                                        <TableCell>
                                            <Input
                                                placeholder="Description"
                                                value={newExpense.description}
                                                onChange={(e) => setNewExpense(v => ({ ...v, description: e.target.value }))}
                                                autoFocus
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={newExpense.amount}
                                                onChange={(e) => setNewExpense(v => ({ ...v, amount: e.target.value }))}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="date"
                                                value={newExpense.date}
                                                onChange={(e) => setNewExpense(v => ({ ...v, date: e.target.value }))}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" className="bg-identity-dillute hover:bg-identity" onClick={submitNew} disabled={!newExpense.description || newExpense.amount === ""}>
                                                Done
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Button variant="outline" className="w-full" onClick={() => { if (!creating) { setCreating(true); setNewExpense({ description: "", amount: "", date: new Date().toISOString().slice(0, 10) }); } }} disabled={creating}>
                                            +
                                        </Button>
                                    </TableCell>
                                </TableRow>


                            </TableBody>

                        </Table>
                    </>)
                    :
                    (<>
                        <Badge variant={"destructive"} className={"mx-auto"}>{error}</Badge>
                        <Table className={"container mx-auto border-2 border-identity-dillute/20 rounded-xl "}>
                            <TableHeader >
                                <TableRow className={"bg-accent rounded-xl"}>
                                    <TH>Customers</TH>
                                    <TH>Status</TH>
                                    <TH>Order Date

                                    </TH>
                                    <TH>Due Date</TH>
                                    <TH>Generate Expense</TH>
                                    <TH>Send an email</TH>
                                    <TH>Receipt</TH>
                                </TableRow>
                            </TableHeader>
                            <TableBody></TableBody>
                        </Table>
                    </>)
            }

        </PageLayout>
    )
    function startEdit(exp) {
        // Convert row to inline edit (optional future enhancement)
        // Not implemented yet per requirements.
    }

    async function handleDelete(exp) {
        // Optimistic remove
        const id = exp.id || exp.expenseId;
        if (!id) return;
        const prev = expenses;
        setExpenses(list => list.filter(e => (e.id || e.expenseId) !== id));
        try {
            await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
        } catch {
            setExpenses(prev); // rollback
        }
    }

    async function submitNew() {
        if (!newExpense.description || newExpense.amount === "") return;
        const payload = {
            description: newExpense.description,
            amount: Number(newExpense.amount),
            date: new Date(newExpense.date).toISOString(),
        };
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error();
            const created = await res.json();
            setExpenses(list => [...list, created]);
            setCreating(false);
        } catch (e) {
            // simple error handling
            alert('Failed to create expense');
        }
    }
}
