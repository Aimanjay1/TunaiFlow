"use client"
import { PageLayout, PageButton, TH, Cell } from "@/components/PageCommon";
import { formatDate, formatDateOnly } from "@/utils/date"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import GenerateInvoicePdfButton from "@/components/GenerateInvoicePdfButton";
import SendInvoiceEmailButton from "@/components/SendInvoiceEmailButton";
import MarkPaidButton from "@/components/MarkPaidButton";
import { useUser } from "@/components/UserProvider";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/loading-screen";
import GetReceiptButton from "@/components/GetReceiptButton";

function Status({ status }) {
    return (
        <div className="border-1 border-black h-6 p-2 w-fit mx-auto rounded-md justify-center items-center flex gap-2">
            {
                (status === "Unpaid") ?
                    (
                        <>
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            Unpaid
                        </>
                    ) : status === "Paid" ?
                        (
                            <>
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                Paid

                            </>
                        ) : (
                            <>
                                <div className="h-3 w-3 rounded-full bg-gray-500" />
                                Cancelled

                            </>
                        )
            }
        </div>
    )
}

export default function Invoice(props) {
    const { user } = useUser();
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function fetchInvoices() {
        if (!user?.sub) return;
        const res = await fetch(`/api/invoices?userId=${user.sub}`, { cache: "no-store" });
        if (!res.ok) {
            setError("Failed to load invoices");
        } else {
            setInvoices(await res.json());
        }
        setLoading(false);
    }

    useEffect(() => { fetchInvoices(); }, [user?.sub])

    if (loading)
        return (
            <LoadingScreen />
        )

    return (
        <PageLayout title="Invoices" subtitle="Generate invoices with just a click of a button">
            <div className="flex gap-4 w-full justify-between">
                <PageButton href="invoices/new">Add New Invoice</PageButton>
                <GetReceiptButton onRefetch={fetchInvoices} />
            </div>
            {

                !error ?
                    (<>
                        {
                            invoices.length > 0 || <div className="container mx-auto">No invoices has been made</div>
                        }
                        <Table className={"container mx-auto mb-20 "}>
                            <colgroup>
                                <col className="min-w-[150px] w-[300px] " />
                            </colgroup>
                            <TableHeader >
                                <TableRow className={"bg-accent rounded-xl"}>
                                    <TH>Customers</TH>
                                    <TH>Description</TH>
                                    <TH>Status</TH>
                                    <TH>Order Date</TH>
                                    <TH>Due Date</TH>
                                    <TH>Total Amount</TH>
                                    <TH>Receipt</TH>
                                    <TH>Actions</TH>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    invoices.map((invoice, index) => (
                                        <TableRow key={index} >
                                            <TableCell className={""}>
                                                <div className="flex flex-col mx-auto  items-center text-center ">
                                                    <div className="text-wrap wrap-anywhere w-fit line-clamp-1 overflow-clip overflow-ellipsis">{invoice.clientName || "Client"}</div>
                                                    <div className="w-fit text-gray-400">id: {invoice.clientId}</div>
                                                </div>
                                            </TableCell>
                                            <Cell>
                                                <div className="">
                                                    {
                                                        invoice.items.map((value, index) => {
                                                            return (index < 3 ?
                                                                (
                                                                    <div key={index}>
                                                                        <p className=" inline underline">
                                                                            {value.itemName}
                                                                        </p>{invoice.items.length == index + 1 ? null : <p className="inline whitespace-pre">,  </p>}
                                                                    </div>
                                                                )
                                                                :
                                                                null
                                                            )
                                                        }
                                                        )
                                                    }
                                                    {
                                                        invoice.items.length >= 3 ? "..." : ""
                                                    }


                                                </div>
                                            </Cell>
                                            <Cell>
                                                <div className="">
                                                    <Status status={invoice.status} />
                                                </div>
                                            </Cell>
                                            <Cell>
                                                {formatDateOnly(invoice.orderDate)}
                                            </Cell>
                                            <Cell>
                                                {formatDateOnly(invoice.dueDate)}
                                            </Cell>
                                            <Cell>
                                                {invoice.totalAmount}
                                            </Cell>
                                            <Cell>
                                                {invoice.receiptId ? (
                                                    <Link
                                                        href={invoice.receiptUrl}
                                                        className="underline"
                                                    >
                                                        Receipt {invoice.receiptId}
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={"#"}
                                                        className="underline text-gray-400"
                                                    >
                                                        No Receipt
                                                    </Link>
                                                )}
                                            </Cell>
                                            <Cell>
                                                <div className="w-full flex justify-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <PageButton className="h-6">v</PageButton>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40 flex flex-col gap-2">
                                                            <Link href={`/invoices/${invoice.invoiceId || "#"}`} className={"bg-identity-dillute hover:bg-identity p-2 text-center text-white rounded-md"}>Invoice</Link>
                                                            <GenerateInvoicePdfButton invoiceId={invoice.invoiceId} />
                                                            <SendInvoiceEmailButton invoiceId={invoice.invoiceId} items={invoice.items} />
                                                            {
                                                                invoice.status === "Paid" ?
                                                                    <></>
                                                                    :
                                                                    <MarkPaidButton
                                                                        invoiceId={invoice.invoiceId}
                                                                        onPaid={() => setInvoices(prev => prev.map(iv => iv.invoiceId === invoice.invoiceId ? { ...iv, status: 'Paid' } : iv))}
                                                                    >mark paid</MarkPaidButton>
                                                            }
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </Cell>

                                        </TableRow>
                                    ))
                                }


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
                                    <TH>Order Date</TH>
                                    <TH>Due Date</TH>
                                    <TH>Generate Invoice</TH>
                                    <TH>Send an email</TH>
                                    <TH>Receipt</TH>
                                </TableRow>
                            </TableHeader>
                            <TableBody></TableBody>
                        </Table>
                    </>)
            }

        </PageLayout >
    )
}