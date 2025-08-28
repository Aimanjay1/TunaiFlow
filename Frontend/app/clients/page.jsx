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
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/loading-screen";

export default function Clients() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const res = await fetch("/api/clients", { cache: "no-store" });
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (!ignore) setClients(data || []);
            } catch {
                if (!ignore) setError("Failed to load clients");
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true };
    }, [])

    if (loading) {
        return <LoadingScreen />
    }
    return (
        <PageLayout title="Client Records">
            <Link href="clients/new" className="bg-identity w-full rounded-2xl p-4 text-4xl text-white text-center hover:bg-identity-dillute duration-200 transition-colors mb-8">
                +
            </Link>

            {!error ? (
                <>
                    {clients.length > 0 || <div className="container mx-auto">No clients has been made</div>}
                    <Table className="container mx-auto border-separate border-spacing-y-4">
                        <TableHeader>
                            <TableRow>
                                <TH>Customer</TH>
                                <TH>Contact Number</TH>
                                <TH>Company Name</TH>
                                <TH>Company Address</TH>
                                <TH>Email</TH>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((Client, i) => (
                                <TableRow
                                    key={i}
                                    className="group"
                                >
                                    <TableCell className="relative text-center z-10 bg-identity-cream first:rounded-l-2xl">
                                        <div className="flex flex-col mx-auto max-w-[200px]">
                                            <h1 className="font-bold truncate">{Client.clientName}</h1>
                                            <p className="text-sm opacity-70">{Client.clientId}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="relative text-center z-10 bg-identity-cream">
                                        010tekan2xdpt
                                    </TableCell>
                                    <TableCell className="relative text-center z-10 bg-identity-cream">
                                        {Client.companyName}
                                    </TableCell>
                                    <TableCell className="relative text-center z-10 bg-identity-cream">
                                        {Client.address}
                                    </TableCell>
                                    <TableCell className="relative text-center z-10 bg-identity-cream last:rounded-r-2xl">
                                        {Client.email}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            ) : (
                <>
                    <Badge variant="destructive" className="mx-auto">{error}</Badge>
                    <Table className={"container mx-auto border-2 border-identity-dillute/20 rounded-xl "}>
                        <TableHeader >
                            <TableRow className={"bg-accent rounded-xl"}>
                                <TH>Customers</TH>
                                <TH>Status</TH>
                                <TH>Order Date

                                </TH>
                                <TH>Due Date</TH>
                                <TH>Generate Client</TH>
                                <TH>Send an email</TH>
                                <TH>Receipt</TH>
                            </TableRow>
                        </TableHeader>
                        <TableBody></TableBody>
                    </Table>
                </>
            )}
        </PageLayout>
    );
}