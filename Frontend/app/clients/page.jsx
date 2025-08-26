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
import { cookies } from "next/headers";
import { useUser } from "@/components/UserProvider";
import { Button } from "@/components/ui/button";


export default async function Clients(props) {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    let error;


    let Clients = [];
    try {
        const res = await fetch(`${process.env.NEXTJS_URL}/api/clients`, {
            headers: {
                Cookie: `session=${session}`,
            },
            cache: "no-store",
        });
        // if (!res.ok) throw new Error('Failed to load Clients');
        if (res.ok)
            Clients = await res.json();
        else
            error = "Failed to load clients"
    } catch (e) {
        // console.error("Failed to load Clients,", e);
        Clients = [];
    }
    return (
        <PageLayout title="Client Records">
            <Link href="clients/new" className="bg-identity w-full rounded-2xl p-4 text-4xl text-white text-center hover:bg-identity-dillute duration-200 transition-colors mb-8">
                +
            </Link>

            {!error ? (
                <>
                    {Clients.length > 0 || <div className="container mx-auto">No clients has been made</div>}
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
                            {Clients.map((Client, i) => (
                                <TableRow
                                    key={i}
                                    className="
                                      group relative
                                      after:content-[''] after:absolute after:inset-0
                                      after:rounded-2xl after:border after:border-neutral-300
                                      after:bg-white after:shadow-sm
                                      hover:after:border-identity hover:after:shadow-md
                                      after:pointer-events-none 
                                    "
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
                                        {Client.CompanyAddress}
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