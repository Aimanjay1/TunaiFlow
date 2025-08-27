import { redirect } from "next/navigation";
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
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import MarkPaidButton from "@/components/MarkPaidButton";


export default async function Invoice(props) {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    let userId;
    if (session) {
        // Replace "your_jwt_secret" with your actual secret if you want to verify
        const payload = jwt.decode(session); // Only decodes, does not verify
        userId = payload?.sub || payload?.userId; // Adjust based on your JWT structure
    }

    let error;

    const res = await fetch(`${process.env.NEXTJS_URL}/api/invoices?userId=${userId}`, {
        headers: {
            Cookie: `session=${session}`,
        },
        cache: "no-store",
    });

    let invoices;

    if (!res.ok) {
        if (res.status === 401) {
            // Clear session cookie by calling logout API
            // redirect("/api/auth/logout");
        }
        error = "Failed to load invoices"
    } else {
        invoices = await res.json();
        // console.log(invoices.map((v, i) => {
        //     return v.status === "Paid" ? "Paid" : null
        // }))
    }

    invoices = invoices || [];

    return (
        <PageLayout title="Invoices" subtitle="Generate invoices with just a click of a button">
            <PageButton href="invoices/new">Add New Invoice</PageButton>
            {

                !error ?
                    (<>
                        {
                            invoices.length > 0 || <div className="container mx-auto">No invoices has been made</div>
                        }
                        <Table className={"container mx-auto mb-20 "}>
                            <TableHeader >
                                <TableRow className={"bg-accent rounded-xl"}>
                                    <TH>Customers</TH>
                                    <TH>Status</TH>
                                    <TH>Order Date</TH>
                                    <TH>Due Date</TH>
                                    <TH>Receipt</TH>
                                    <TH>Actions</TH>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    invoices.map((invoice, index) => (
                                        <TableRow key={index} >
                                            <Cell>
                                                <div className="flex flex-col">
                                                    <div className="">{invoice.clientName || "Client"}</div>
                                                    <div className="">{invoice.clientId}</div>
                                                </div>
                                            </Cell>
                                            <Cell>
                                                <div className="border-1 border-black h-6 p-2 w-fit mx-auto rounded-md justify-center items-center flex gap-2">
                                                    {
                                                        (invoice.status === "Unpaid") ?
                                                            (
                                                                <>
                                                                    <div className="h-3 w-3 rounded-full bg-red-500" />
                                                                    Unpaid
                                                                </>
                                                            ) : invoice.status === "Paid" ?
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
                                            </Cell>
                                            <Cell>
                                                {formatDateOnly(invoice.orderDate)}
                                            </Cell>
                                            <Cell>
                                                {formatDateOnly(invoice.dueDate)}
                                            </Cell>
                                            <Cell>
                                                <Link href={`/invoices${invoice.receiptId ? "/" + invoice.receiptId : "#"}`} className=" underline ">
                                                    {(invoice.receiptId ? "Receipt " + invoice.receiptId : "No receipt")}
                                                </Link>
                                            </Cell>
                                            <Cell>
                                                <div className="w-full flex justify-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <PageButton className="h-6">v</PageButton>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-32 flex flex-col gap-2">
                                                            <Link href={`/invoices/${invoice.invoiceId || "#"}`} className={"bg-identity-dillute hover:bg-identity p-2 text-center text-white rounded-md"}>Invoice</Link>
                                                            <Button className={"bg-identity-dillute hover:bg-identity"}>send email</Button>
                                                            {
                                                                invoice.status === "Paid" ?
                                                                    <></>
                                                                    :
                                                                    <MarkPaidButton invoiceId={invoice.invoiceId}>mark paid</MarkPaidButton>
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