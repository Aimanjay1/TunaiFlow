import { NextResponse } from "next/server";

const COOKIE_NAME = "session";

export async function GET(request) {
    const id = request.nextUrl.searchParams.get("userId");
    console.log("id", id)
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        // Fetch invoices, clients, and receipts in parallel
        const [invoiceRes, clientRes, receiptRes] = await Promise.all([
            fetch(`${process.env.BACKEND_URL}/api/Invoices/user/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${process.env.BACKEND_URL}/api/Clients`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${process.env.BACKEND_URL}/api/Receipts`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (!invoiceRes.ok) {
            const body = await invoiceRes.json().catch(() => null);
            return NextResponse.json({ error: body?.error || 'Failed to fetch invoices' }, { status: invoiceRes.status });
        }
        if (!clientRes.ok) {
            const body = await clientRes.json().catch(() => null);
            return NextResponse.json({ error: body?.error || 'Failed to fetch clients' }, { status: clientRes.status });
        }
        // receipts are optional; continue if they fail
        let receipts = [];
        if (receiptRes.ok) {
            receipts = await receiptRes.json().catch(() => []);
        }

        const clients = await clientRes.json();
        const invoices = await invoiceRes.json();

        const clientsMap = new Map();
        for (const c of clients) clientsMap.set(c.clientId, c.clientName);

        // Build receipts grouped by payer for quick lookup
        const receiptGroups = new Map();
        for (const r of receipts) {
            const key = (r.payer || '').trim().toLowerCase();
            if (!receiptGroups.has(key)) receiptGroups.set(key, []);
            receiptGroups.get(key).push(r);
        }

        // Attach clientName and first matching receipt (or latest) to each invoice
        for (const inv of invoices) {
            const cname = clientsMap.get(inv.clientId) || null;
            inv.clientName = cname;
            if (cname) {
                const group = receiptGroups.get(cname.trim().toLowerCase());
                if (group && group.length) {
                    // choose the most recent receipt by date
                    group.sort((a, b) => new Date(b.date) - new Date(a.date));
                    const chosen = group[0];
                    inv.receiptUrl = chosen.receiptUrl;
                    inv.receiptId = chosen.id;
                }
            }
        }

        return NextResponse.json(invoices, { status: 200 });

    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }




    // If Flask always returns JSON, use:
    // const data = await res.json().catch(() => null);
    // if (!res.ok) {
    //     return NextResponse.json({ error: data?.error || "Failed to fetch invoices" }, { status: res.status });
    // }
    // return NextResponse.json(data, { status: res.status });
}
export async function POST(request) {
    const id = request.nextUrl.searchParams.get("userId");
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


    const body = await request.json()
    const jsonbody = JSON.stringify(body)
    const res = await fetch(`${process.env.BACKEND_URL}/api/Invoices`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: jsonbody,
    });
    // console.log(jsonbody)

    // If Flask always returns JSON, use:
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        return NextResponse.json({ error: data?.error || "Failed to create invoice" }, { status: res.status });
    }
    return NextResponse.json(data, { status: res.status });
}