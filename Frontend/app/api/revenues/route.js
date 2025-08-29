import { NextResponse } from "next/server";


export async function GET(request) {
    const id = request.nextUrl.searchParams.get("userId");
    const token = request.cookies.get(process.env.COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const res = await fetch(`${process.env.BACKEND_URL}/api/Revenues`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(res)

    // If Flask always returns JSON, use:
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        return NextResponse.json({ error: data?.error || "Failed to fetch Revenues" }, { status: res.status });
    }

    return NextResponse.json(data, { status: res.status });
}
export async function POST(request) {
    const body = await request.json()
    const token = request.cookies.get(process.env.COOKIE_NAME)?.value;
    // console.log("token", token)
    // if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const res = await fetch(`${process.env.BACKEND_URL}/api/Revenues`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        method: "POST",
    });
    const data = await res.json().catch(() => null);

    return NextResponse.json(data, { status: res.status });

}