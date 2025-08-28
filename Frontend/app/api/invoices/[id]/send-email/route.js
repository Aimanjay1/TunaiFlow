import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const id = params.id;
  if (!id) return NextResponse.json({ error: "Missing invoice id" }, { status: 400 });
  const token = req.cookies.get(process.env.COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const backendUrl = `${process.env.BACKEND_URL}/api/Invoices/${id}/send-email`;
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    let body = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json({ error: body?.error || body?.message || 'Backend failed' }, { status: res.status });
    }
    return NextResponse.json({ ok: true, message: body?.message || 'Email queued' });
  } catch (e) {
    return NextResponse.json({ error: 'Network error' }, { status: 500 });
  }
}