import { NextResponse } from "next/server";

export async function GET(request) {
    let arr = [{ num: "one" }, { num: "two" }, { num: "three" }]
    arr.map((value, index, array) => {
        value.num = "Shi"
    })
    const body = { lol: arr }
    return NextResponse.json(body, { status: 200 })
}