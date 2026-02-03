import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { hashPassword } from "@/app/lib/auth";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const { email, password, firstName, lastName, phone } = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { error: "Email & password required" },
            { status: 400 }
        );
    }

    const existing = db
        .prepare("SELECT id FROM users WHERE email = ?")
        .get(email);

    if (existing) {
        return NextResponse.json(
            { error: "User already exists" },
            { status: 409 }
        );
    }

    const passwordHash = await hashPassword(password);

    db.prepare(`
    INSERT INTO users (id, email, password_hash, first_name, last_name, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
        randomUUID(),
        email,
        passwordHash,
        firstName,
        lastName,
        phone
    );

    return NextResponse.json({ success: true });
}
