import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const id = params.id;
  const cookie = req.cookies.get(process.env.COOKIE_NAME)?.value;
  const backendUrl = `${process.env.BACKEND_URL}/api/Invoices/${id}/send-email`;
  const res = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cookie}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json().catch(()=>null);
  return NextResponse.json(data || { ok: res.ok });
}