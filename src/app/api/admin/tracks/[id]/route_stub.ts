
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

// Helper to save file
async function saveFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/${folder}/${filename}`;
}

// GET: Fetch single track with licenses
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const track = db.prepare("SELECT * FROM tracks WHERE id = ?").get(id) as any;

        if (!track) {
            return NextResponse.json({ error: "Track not found" }, { status: 404 });
        }

        // Fetch associated licenses
        const licenses = db.prepare("SELECT * FROM track_licenses WHERE trackId = ?").all(id);

        // Parse JSON fields
        track.tags = track.tags ? JSON.parse(track.tags) : [];

        // Return combined data
        return NextResponse.json({ ...track, licenses });

    } catch (error) {
        console.error("Error fetching track:", error);
        return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
    }
}

// PUT: Update track
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const formData = await req.formData();

        const title = formData.get("title") as string;
        const bpm = parseInt(formData.get("bpm") as string) || 0;
        const tags = formData.get("tags") as string;
        const genre = formData.get("genre") as string;
        const licensesStr = formData.get("licenses") as string;

        const coverFile = formData.get("cover") as File | null;
        const audioFile = formData.get("audio") as File | null;

        // Transaction
        const updateTx = db.transaction(() => {
            // 1. Update basic fields
            db.prepare(`
                UPDATE tracks 
                SET title = @title, bpm = @bpm, tags = @tags, genre = @genre, updated_at = CURRENT_TIMESTAMP
                WHERE id = @id
            `).run({ title, bpm, tags, genre, id }); // Note: 'genre' column might be missing in DB schema?? Check Check Check!

            // WAIT! I don't remember seeing 'genre' column in the `db.ts` file I viewed earlier. 
            // Step 841: Tracks table: id, title, artist, duration, bpm, tags, thumbnail_url, audio_url, price, featured...
            // NO GENRE COLUMN! 
            // I MUST ADD GENRE COLUMN TO DB SCHEMA FIRST OR THIS WILL FAIL!

            // 2. Handle Files
            // (Async file ops inside transaction is bad practice but for sqlite/local fs it's "okay" if careful, 
            // strictly mostly synchronous in node sqlite, but file saving is async. 
            // Better to save file outside, then update DB. But here we are inside logic block.
            // I will move file saving OUTSIDE transaction scope in code structure, but here let's valid.)
        });

        // Check for genre column... 
        // I will need to migrate DB again.

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
// I will abort writing this file until I fix the DB schema for 'genre'.
