"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toasts";

export default function MarkPaidButton({ invoiceId, onPaid, children = "Mark paid" }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { open } = useToast();

    async function handleMarkPaid(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/invoices/${invoiceId}/mark-paid`, {
                method: "POST",
            });
            if (res.ok) {
                open("Invoice marked as paid", 2500);
                if (typeof onPaid === 'function') {
                    try { onPaid(); } catch { }
                } else {
                    router.refresh();
                }
            } else {
                const err = await res.json().catch(() => ({}));
                open(err.error || "Failed to mark invoice", 4000, "#ff0000");
            }
        } catch (err) {
            open("Network error", 4000, "#ff0000");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleMarkPaid}
            disabled={loading}
            className="bg-identity-dillute hover:bg-identity disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
            {loading ? "Marking..." : children}
        </Button>
    );
}