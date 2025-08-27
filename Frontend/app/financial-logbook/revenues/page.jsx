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
import { RadioGroupDemo } from "@/components/RadioGroupDemo";
import { cookies } from "next/headers";
import Link from "next/link";
import { string } from "zod";


function RevenueButton({ children, className, variant }) {
    variant = (variant ? "bg-" + variant : "bg-identity-dillute hover:bg-identity")
    className = variant + " " + (className || "")
    console.log("className,", className)
    return (
        <Button className={className} >
            {children}
        </Button >
    )
}

export default async function Revenues(props) {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    let error;
    let Revenues = [];
    try {
        const res = await fetch(`${process.env.NEXTJS_URL}/api/revenues`, {
            headers: {
                Cookie: `session=${session}`,
            },
            method: "GET",
            cache: 'no-store'
        });
        // if (!res.ok) throw new Error('Failed to load Revenues');
        if (res.ok) {
            Revenues = await res.json();
            console.log("res.ok Revenues", Revenues)
        }

    } catch (e) {
        console.log("!res.ok Revenues", Revenues)
        Revenues = [];
        error = "Failed to load Revenues"
    }
    let totalRev = 0
    let revGoal = 1000
    Revenues.map((v, i) => { totalRev += v.amount })
    return (
        <PageLayout title="Revenues">
            <div className="container mx-auto">
                {
                    !error ?
                        (<>
                            <div className="max-w-2xl mx-auto">
                                <RadioGroupDemo />
                            </div>
                            {
                                Revenues.length > 0 || <div className="container mx-auto">No revenue has been made</div>
                            }
                            <Table className={"max-w-2xl mx-auto border-2 border-identity-dillute/20 rounded-xl "}>
                                <colgroup>
                                    {/* <col className="w-32" />
                                    <col className="w-32" />
                                    <col className="w-32" /> */}
                                </colgroup>
                                <TableHeader >
                                    <TableRow className={"bg-accent rounded-xl"}>
                                        <TH>Invoice ID</TH>
                                        <TH>Invoice</TH>
                                        <TH>Total Payment</TH>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        Revenues.map((Revenue, index) => (
                                            <TableRow key={index} >
                                                <Cell>
                                                    {Revenue.invoiceId}
                                                </Cell>
                                                <Cell>
                                                    <Link href={`/invoices/${Revenue.invoiceId}`} className="underline">
                                                        Invoice {Revenue.invoiceId}
                                                    </Link>
                                                </Cell>
                                                <Cell>
                                                    {Revenue.amount}
                                                </Cell>
                                            </TableRow>
                                        ))
                                    }


                                </TableBody>
                            </Table>
                            <Table className={"max-w-2xl mx-auto my-12 gap-2 flex flex-col mb-40"}>
                                <TableBody >
                                    <TableRow  >
                                        <TableCell>Total Revenue</TableCell>
                                        <TableCell>RM {totalRev}</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell>Revenue Goal (August)</TableCell>
                                        <TableCell>RM {revGoal}</TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell>Status</TableCell>
                                        <TableCell>{`${(totalRev / revGoal * 100).toFixed(2)}`}%  reached</TableCell>
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
                                        <TH>Invoice ID</TH>
                                        <TH>Invoice</TH>
                                        <TH>Total Payment</TH>
                                    </TableRow>
                                </TableHeader>
                                <TableBody></TableBody>
                            </Table>
                        </>)
                }
            </div>
        </PageLayout >
    )
}
