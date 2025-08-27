import { PageLayout } from "@/components/PageCommon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FinancialLogbook() {
    return (
        <main className="flex flex-col flex-1 min-h-0 w-full mx-auto">
            <div className="max-w-2xl w-full mx-auto my-12">
                <h1 className="text-5xl font-bold mb-8">Get on track with your financial today</h1>
                <p>Still keeping your old logbook? Replace the with ours.</p>
            </div>
            <div className="max-w-2xl w-full mx-auto my-4 flex flex-col gap-4 p-4">
                <Link className={"flex w-full p-6 text-2xl rounded-full justify-center bg-identity text-background hover:bg-foreground transition-colors duration-1000"} href={"/financial-logbook/revenues"}>Revenue</Link>
                <Link className={"flex w-full p-6 text-2xl rounded-full justify-center bg-foreground text-background hover:bg-identity-dillute transition-colors duration-1000"} href={"/financial-logbook/expenses"}>Expenses</Link>
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center bg-black">
                <img src="/images/finbook.png" className="w-full h-full object-cover" alt="finlogbook" />
            </div>

        </main>
    )
}