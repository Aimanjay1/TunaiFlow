"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/Toasts";
import { useRouter } from "next/navigation";

export default function GenerateInvoicePdfButton({ invoiceId, children = "Generate PDF" }) {
    const [loading, setLoading] = useState(false);
    const { open } = useToast();
    const router = useRouter();

    async function handleClick(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/invoices/${invoiceId}/generate-pdf`, { method: "POST" });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                open(body.error || body.message || "Failed to generate PDF", 4000, "#ff0000");
            } else {
                const body = await res.json().catch(() => ({}));
                open(body.message || "PDF generation started", 2500);
                // Optional refresh if backend updates invoice state
                router.refresh();
            }
        } catch (err) {
            open("Network error", 4000, "#ff0000");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleClick}
            disabled={loading}
            className="bg-identity-dillute hover:bg-identity disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
            {loading ? "Generating…" : children}
        </Button>
    );
}
