"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/Toasts";
import { useRouter } from "next/navigation";

export default function GetReceiptButton({ invoiceId, onRefetch, children = "Get receipt" }) {
    const [loading, setLoading] = useState(false);
    const { open } = useToast();
    const router = useRouter();

    async function handleClick(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/receipts/ingest-email`, { method: "POST" });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                open(body.error || body.message || "Failed to send email", 4000, "#ff0000");
            } else {
                const body = await res.json().catch(() => ({}));
                open(body.message || "Ingested", 2500);
                // Refetch invoices (with stitched receipts) if callback supplied
                if (typeof onRefetch === 'function') {
                    try {
                        const userId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('userId') : null;
                        // Prefer provided callback to fetch inside page component
                        await onRefetch();
                    } catch { /* ignore */ }
                } else {
                    router.refresh();
                }
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
            {loading ? "Ingesting..." : children}
        </Button>
    );
}
