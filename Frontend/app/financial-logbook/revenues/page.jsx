"use client"
import { useEffect, useState } from "react";
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
import Link from "next/link";
import LoadingScreen from "@/components/loading-screen";

export default function Revenues() {
    const [revenues, setRevenues] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const res = await fetch("/api/revenues", { cache: "no-store" });
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (!ignore) setRevenues(data || []);
            } catch {
                if (!ignore) setError("Failed to load Revenues");
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true }
    }, [])

    if (loading) return <LoadingScreen />

    const totalRev = revenues.reduce((sum, r) => sum + (r.amount || 0), 0)
    const revGoal = 1000
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
                                revenues.length > 0 || <div className="container mx-auto">No revenue has been made</div>
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
                                        revenues.map((Revenue, index) => (
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
