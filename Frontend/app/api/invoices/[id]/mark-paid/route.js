import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing invoice id" }, { status: 400 });

    try {
        const token = request.cookies.get(process.env.COOKIE_NAME)?.value;
        const res = await fetch(`${process.env.BACKEND_URL}/api/Invoices/${id}/mark-paid`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });

        if (!res.ok) {
            let body = null;
            try { body = await res.json(); } catch { }
            return NextResponse.json({ error: body?.error || 'Backend failed' }, { status: res.status });
        }

        let data = null;
        try { data = await res.json(); } catch { }
        return NextResponse.json(data || { success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Network error' }, { status: 500 });
    }
}
