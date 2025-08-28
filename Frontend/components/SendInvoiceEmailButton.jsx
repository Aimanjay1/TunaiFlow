"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/Toasts";
import { useRouter } from "next/navigation";

export default function SendInvoiceEmailButton({ invoiceId, children = "Send Email" }) {
    const [loading, setLoading] = useState(false);
    const { open } = useToast();
    const router = useRouter();

    async function handleClick(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/invoices/${invoiceId}/send-email`, { method: "POST" });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                open(body.error || body.message || "Failed to send email", 4000, "#ff0000");
            } else {
                const body = await res.json().catch(() => ({}));
                open(body.message || "Email queued", 2500);
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
            {loading ? "Sending…" : children}
        </Button>
    );
}
