import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (sessionId) {
        db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
    }

    // Delete the cookie
    cookieStore.delete("session");

    return NextResponse.json({ success: true });
}
