
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

        const licenses = db.prepare(`
            SELECT * FROM track_licenses WHERE isActive = 1
        `).all();

        // Attach licenses to tracks
        const tracksWithLicenses = tracks.map((track: any) => {
            const trackLicenses = licenses.filter((l: any) => l.trackId === track.id);
            return {
                ...track,
                licenses: trackLicenses
            };
        });

        return NextResponse.json(tracksWithLicenses);
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
        const key = formData.get("key") as string || "";
        const tags = formData.get("tags") as string; // JSON string
        const licensesStr = formData.get("licenses") as string; // JSON string of [{type, price}]
        const genre = formData.get("genre") as string || "Trap";

        const duration = parseInt(formData.get("duration") as string) || 0;
        const price = parseFloat(formData.get("price") as string) || 0;

        // Files & URLs
        const coverFile = formData.get("cover") as File | null;
        const audioFile = formData.get("audio") as File | null;
        const audioUrlParam = formData.get("audioUrl") as string | null;
        const coverUrlParam = formData.get("coverUrl") as string | null;

        if (!title || (!audioFile && !audioUrlParam)) {
            return NextResponse.json({ error: "Title and Audio Source (File or URL) are required" }, { status: 400 });
        }

        // Save Files
        let coverUrl = coverUrlParam || "";
        let audioUrl = audioUrlParam || "";

        if (coverFile) {
            coverUrl = await saveFile(coverFile, "covers");
        }

        if (audioFile) {
            audioUrl = await saveFile(audioFile, "audio");
        }

        // Database Transaction
        const insertTrack = db.transaction(() => {
            // 1. Insert Track - Added key
            const stmt = db.prepare(`
                INSERT INTO tracks (title, artist, bpm, key, tags, genre, coverArtUrl, audio_url, price, duration, status, created_at, updated_at)
                VALUES (@title, @artist, @bpm, @key, @tags, @genre, @coverArtUrl, @audio_url, @price, @duration, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `);

            const info = stmt.run({
                title,
                artist,
                bpm,
                key, // Added key here
                tags,
                genre,
                coverArtUrl: coverUrl,
                audio_url: audioUrl,
                price,
                duration
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

    } catch (error: any) {
        console.error("Error creating track:", error);
        return NextResponse.json({ error: `Failed to create track: ${error.message}` }, { status: 500 });
    }
}
