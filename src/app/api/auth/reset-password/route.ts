import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { hashPassword } from "@/app/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
        return NextResponse.json(
            { error: "Missing token or password" },
            { status: 400 }
        );
    }

    if (newPassword.length < 6) {
        return NextResponse.json(
            { error: "Password must be at least 6 characters" },
            { status: 400 }
        );
    }

    const user = db
        .prepare("SELECT * FROM users WHERE resetPasswordToken = ?")
        .get(token) as any;

    if (!user) {
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 400 }
        );
    }

    const now = new Date();
    const expires = new Date(user.resetPasswordTokenExpires);

    if (now > expires) {
        return NextResponse.json(
            { error: "Token expired" },
            { status: 400 }
        );
    }

    const hashedPassword = await hashPassword(newPassword);

    try {
        db.prepare(`
            UPDATE users 
            SET password_hash = ?, resetPasswordToken = NULL, resetPasswordTokenExpires = NULL 
            WHERE id = ?
        `).run(hashedPassword, user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        );
    }
}
