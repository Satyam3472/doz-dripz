import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json(
            { error: "Missing token" },
            { status: 400 }
        );
    }

    const user = db
        .prepare("SELECT * FROM users WHERE verificationToken = ?")
        .get(token) as any;

    if (!user) {
        return NextResponse.json(
            { error: "Invalid token" },
            { status: 400 }
        );
    }

    const now = new Date();
    const expires = new Date(user.verificationTokenExpires);

    if (now > expires) {
        return NextResponse.json(
            { error: "Token expired" },
            { status: 400 }
        );
    }

    // Verify user and clear token
    db.prepare(`
        UPDATE users 
        SET isVerified = 1, verificationToken = NULL, verificationTokenExpires = NULL 
        WHERE id = ?
    `).run(user.id);

    // Redirect to login with success message
    return NextResponse.redirect(new URL("/login?verified=true", req.url));
}
