
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session")?.value;

        if (!sessionId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const session = db
            .prepare("SELECT * FROM sessions WHERE id = ? AND expires_at > ?")
            .get(sessionId, new Date().toISOString()) as any;

        if (!session) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        // Fetch Purchases
        // Join not strictly needed if we stored everything, but good practice if we want to get fresh cover images from TRACKS if not stored (we didn't store cover in purchases, only fileUrl).
        // Actually, we didn't store cover in purchases. We stored trackId.
        // We should join with TRACkS to get the cover image. 
        // Wait, TRACKS is in `lib/data.ts` (flat file) AND `tracks` table (DB).
        // The `seed.ts` populates `tracks` table.
        // So we can join with `tracks` table.

        const purchases = db.prepare(`
            SELECT 
                p.id,
                p.trackId,
                p.trackName,
                t.artist,
                p.licenseType,
                p.amount,
                p.fileUrl,
                p.invoiceUrl,
                p.createdAt,
                t.thumbnail_url as cover
            FROM purchases p
            LEFT JOIN tracks t ON t.id = p.trackId -- Joining on trackId (assuming p.trackId matches t.id? p.trackId is stored as TEXT, t.id is INTEGER. SQLite handles this usually but cast might be safe)
            WHERE p.userId = ?
            ORDER BY p.createdAt DESC
        `).all(session.user_id);

        return NextResponse.json({ purchases });
    } catch (error) {
        console.error("Dashboard fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
