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

export default async function Invoice(props) {
    const cookieStore = cookies();
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
        console.log(invoices)
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
                        <Table className={"container mx-auto border-2 border-identity-dillute/20 rounded-xl "}>
                            <TableHeader >
                                <TableRow className={"bg-accent rounded-xl"}>
                                    <TH>Client ID</TH>
                                    <TH>Status</TH>
                                    <TH>Order Date</TH>
                                    <TH>Due Date</TH>
                                    <TH>Generate Invoice</TH>
                                    <TH>Send an email</TH>
                                    <TH>Receipt</TH>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    invoices.map((invoice, index) => (
                                        <TableRow key={index} >
                                            <Cell>
                                                {invoice.clientId}
                                            </Cell>
                                            <Cell>
                                                {invoice.status}
                                            </Cell>
                                            <Cell>
                                                {formatDateOnly(invoice.orderDate)}
                                            </Cell>
                                            <Cell>
                                                {formatDateOnly(invoice.dueDate)}
                                            </Cell>
                                            <Cell>
                                                {/* <InvoiceButton> */}
                                                {/* <Link href={`/invoices/${invoice.InvoiceId}`} className="bg-identity-dillute text-background rounded-md p-2">
                                                    {invoice.InvoicePdfFileName}
                                                </Link> */}
                                                {/* </InvoiceButton> */}
                                            </Cell>
                                            <Cell>
                                                <div className="w-full flex justify-center">
                                                    <PageButton>send email</PageButton>
                                                </div>
                                            </Cell>
                                            <Cell>
                                                {/* <Link
                                                    href={"/invoices"}>
                                                </Link>
                                                 */}
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
                                    <TH>Order Date

                                    </TH>
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

        </PageLayout>
    )
}

const dummyCustomers = [
    {
        InvoiceId: "INV0001",
        ClientId: "CS0001",
        UserId: "US0001",
        Status: "Cancelled",
        OrderDate: "DD/MM/YYYY",
        DueDate: "DD/MM/YYYY",
        TotalAmount: 1000,
        CreatedAt: "DD/MM/YYYY HH:MM:SS",

        InvoicePdfFileName: "",
        EmailMessageId: "",
        EmaiThreadId: "",
        InvoiceEmailSentAt: "",

        Client: {},
        User: {},
        Items: {},
        Receipts: {}
    },
];