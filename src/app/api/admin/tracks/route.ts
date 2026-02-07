
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { headers } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs"; // Required for file system ops

// Helper to save file
async function saveFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name
    const ext = path.extname(file.name);
    const filename = `${crypto.randomUUID()}${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    return `/uploads/${folder}/${filename}`;
}

// GET: List all tracks (Admin view)
export async function GET() {
    try {
        const tracks = db.prepare(`
            SELECT * FROM tracks ORDER BY created_at DESC
        `).all();

        return NextResponse.json(tracks);
    } catch (error) {
        console.error("Error fetching admin tracks:", error);
        return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
    }
}

// POST: Create new track
export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // Extract fields
        const title = formData.get("title") as string;
        const artist = formData.get("artist") as string || "DOZ DRIPZ";
        const bpm = parseInt(formData.get("bpm") as string) || 0;
        const tags = formData.get("tags") as string; // JSON string
        const licensesStr = formData.get("licenses") as string; // JSON string of [{type, price}]
        const genre = formData.get("genre") as string || "Trap";

        // Files
        const coverFile = formData.get("cover") as File | null;
        const audioFile = formData.get("audio") as File | null;

        if (!title || !audioFile) {
            return NextResponse.json({ error: "Title and Audio File are required" }, { status: 400 });
        }

        // Save Files
        let coverUrl = "";
        let audioUrl = "";

        if (coverFile) {
            coverUrl = await saveFile(coverFile, "covers");
        }

        if (audioFile) {
            audioUrl = await saveFile(audioFile, "audio");
        }

        // Database Transaction
        const insertTrack = db.transaction(() => {
            // 1. Insert Track
            const stmt = db.prepare(`
                INSERT INTO tracks (title, artist, bpm, tags, genre, coverArtUrl, audio_url, status, created_at, updated_at)
                VALUES (@title, @artist, @bpm, @tags, @genre, @coverArtUrl, @audio_url, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `);

            const info = stmt.run({
                title,
                artist,
                bpm,
                tags,
                genre,
                coverArtUrl: coverUrl,
                audio_url: audioUrl
            });

            const trackId = info.lastInsertRowid;

            // 2. Insert Licenses
            if (licensesStr) {
                const licenses = JSON.parse(licensesStr); // [{type, price}]

                const dbLicenses = db.prepare("SELECT * FROM licenses").all() as any[];

                const licStmt = db.prepare(`
                    INSERT INTO track_licenses (trackId, licenseType, price, isActive, contractFeatures)
                    VALUES (@trackId, @licenseType, @price, 1, @contractFeatures)
                `);

                for (const lic of licenses) {
                    // Find default features for this license type
                    const defaultLic = dbLicenses.find(l => l.name === lic.type);
                    const features = defaultLic ? defaultLic.features : "[]"; // defaultLic.features is JSON string in DB

                    licStmt.run({
                        trackId,
                        licenseType: lic.type,
                        price: lic.price,
                        contractFeatures: features
                    });
                }
            }

            return trackId;
        });

        const newTrackId = insertTrack();

        return NextResponse.json({ success: true, trackId: newTrackId });

    } catch (error) {
        console.error("Error creating track:", error);
        return NextResponse.json({ error: "Failed to create track" }, { status: 500 });
    }
}
