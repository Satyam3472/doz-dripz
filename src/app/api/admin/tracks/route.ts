import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Helper to save file
async function saveFile(file: File, subDir: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');

    const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return `/uploads/${subDir}/${filename}`;
}

export async function GET(req: Request) {
    try {
        // Auth Check
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session")?.value;
        if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = db.prepare("SELECT users.role FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = ?").get(sessionId) as { role: string };
        if (!session || (session.role !== 'ADMIN' && session.role !== 'MUSICIAN')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const tracks = db.prepare("SELECT * FROM tracks ORDER BY created_at DESC").all();
        // Include licenses?
        // For list view, maybe just base info is fine.

        return NextResponse.json({ tracks });
    } catch (error) {
        console.error("Admin Tracks GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // Auth Check
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session")?.value;
        if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = db.prepare("SELECT users.role FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = ?").get(sessionId) as { role: string };
        if (!session || (session.role !== 'ADMIN' && session.role !== 'MUSICIAN')) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const artist = formData.get("artist") as string; // defaults to 'DOZ DRIPZ' in frontend maybe?
        const bpm = formData.get("bpm") ? Number(formData.get("bpm")) : null;
        const key = formData.get("key") as string;
        const tags = formData.get("tags") as string; // JSON string
        const price = 0; // Base price obsolete? Or use for default? Let's use 0.

        const coverFile = formData.get("cover") as File | null;
        const audioFile = formData.get("audio") as File | null;

        if (!title || !audioFile) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Handle File Uploads
        let coverUrl = null;
        if (coverFile) {
            coverUrl = await saveFile(coverFile, "covers");
        }

        const audioUrl = await saveFile(audioFile, "audio");

        // Insert Track
        const insertStmt = db.prepare(`
            INSERT INTO tracks (title, artist, bpm, key, tags, thumbnail_url, audio_url, price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
        `);

        const result = insertStmt.run(title, artist || 'DOZ DRIPZ', bpm, key, tags, coverUrl, audioUrl, price);
        const trackId = result.lastInsertRowid;

        // Handle Licenses
        const licensesJson = formData.get("licenses") as string; // JSON string from frontend
        if (licensesJson) {
            const licenses = JSON.parse(licensesJson);
            const insertLicense = db.prepare(`
                INSERT INTO track_licenses (trackId, licenseType, price)
                VALUES (?, ?, ?)
            `);

            const insertMany = db.transaction((items) => {
                for (const item of items) insertLicense.run(trackId, item.type, item.price);
            });

            insertMany(licenses);
        }

        return NextResponse.json({ success: true, trackId });

    } catch (error) {
        console.error("Admin Track Create Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
