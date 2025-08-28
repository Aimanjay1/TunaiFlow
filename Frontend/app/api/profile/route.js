import { NextResponse } from "next/server";

function decodeJwt(token) {
    try {
        const [, payload] = token.split('.');
        const json = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
        return json;
    } catch {
        return null;
    }
}

export async function GET(request) {
    const token = request.cookies.get(process.env.COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: 'No auth token' }, { status: 401 });

    const payload = decodeJwt(token);
    const userId = payload?.userId || payload?.sub || payload?.nameid; // common claim fallbacks
    if (!userId) return NextResponse.json({ error: 'Could not determine user id' }, { status: 400 });

    // Attempt primary route; fall back to plural if needed
    const base = process.env.BACKEND_URL;
    const urls = [
        `${base}/api/User/${userId}`,
        `${base}/api/Users/${userId}`,
    ];

    let data = null;
    for (const url of urls) {
        try {
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store'
            });
            if (res.ok) {
                data = await res.json();
                break;
            }
        } catch {
            // continue
        }
    }

    if (!data) return NextResponse.json({ error: 'Profile fetch failed' }, { status: 502 });

    return NextResponse.json(data);
}
