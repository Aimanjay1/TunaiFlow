"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Custom404() {
    return (
        <div className="flex flex-col min-w-full flex-1 bg-gradient-to-t from-identity to-accent justify-center items-center gap-4">
            <h1 className="text-4xl text-center z-10">404 - Page Not Found</h1>
            <Link href={"/dashboard"} className="bg-gradient-to-tr from-identity-blue to-identity-blue/50 shadow-md text-white p-4 rounded-xl">Go to dashboard</Link>
        </div>
    )
}