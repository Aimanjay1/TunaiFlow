import { NextResponse } from "next/server";
const COOKIE_NAME = "session";
const AUTH_PREFIX = "/auth";

export function middleware(request) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/_next") || pathname === "/favicon.ico" || pathname === "/") return NextResponse.next();

    if (pathname.startsWith(AUTH_PREFIX)) {
        return token ? NextResponse.redirect(new URL("/dashboard", request.url)) : NextResponse.next();
    }

    if (!token) {
        console.log("No token!")
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    console.log("Yes token!")
    return NextResponse.next();
}
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:png|jpg|svg|css|js)).*)"
    ],
};