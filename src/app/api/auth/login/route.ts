import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { verifyPassword } from "@/app/lib/auth";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const { email, password, remember } = await req.json();

    const user = db
        .prepare("SELECT * FROM users WHERE email = ?")
        .get(email) as any;

    if (!user || !(await verifyPassword(password, user.password_hash))) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    if (user.isVerified === 0) {
        return NextResponse.json(
            { error: "Email not verified", code: "EMAIL_NOT_VERIFIED" },
            { status: 403 }
        );
    }

    const sessionId = randomUUID();
    // 30 days if remember is true, else 24 hours
    const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
    const expires = new Date(Date.now() + maxAge * 1000);

    try {
        db.prepare(`
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES (?, ?, ?)
    `).run(sessionId, user.id, expires.toISOString());
    } catch (err) {
        console.error("Session insert error:", err);
        return NextResponse.json(
            { error: "Failed to create session" },
            { status: 500 }
        );
    }

    const res = NextResponse.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role
        }
    });

    res.cookies.set("session", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expires,
        path: "/",
    });

    return res;
}
