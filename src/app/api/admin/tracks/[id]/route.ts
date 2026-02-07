
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

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

// GET: Fetch single track details
export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const id = params.id;
        const track = db.prepare("SELECT * FROM tracks WHERE id = ?").get(id);

        if (!track) {
            return NextResponse.json({ error: "Track not found" }, { status: 404 });
        }

        const licenses = db.prepare("SELECT * FROM track_licenses WHERE trackId = ?").all(id);

        return NextResponse.json({ ...track, licenses });
    } catch (error) {
        console.error("Error fetching track:", error);
        return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
    }
}

// PUT: Update track details
export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const id = params.id;
        const formData = await req.formData();

        // Extract fields
        const title = formData.get("title") as string;
        const artist = formData.get("artist") as string;
        const bpm = parseInt(formData.get("bpm") as string) || 0;
        const key = formData.get("key") as string || "";
        const tags = formData.get("tags") as string;
        const genre = formData.get("genre") as string;
        const duration = parseInt(formData.get("duration") as string) || 0;
        const price = parseFloat(formData.get("price") as string) || 0;

        const licensesStr = formData.get("licenses") as string; // JSON

        // Files & URLs
        const coverFile = formData.get("cover") as File | null;
        const audioFile = formData.get("audio") as File | null;
        const coverUrlParam = formData.get("coverUrl") as string | null;
        const audioUrlParam = formData.get("audioUrl") as string | null;

        let coverUrl = coverUrlParam;
        let audioUrl = audioUrlParam;

        // Handle file uploads if new files are provided
        if (coverFile) {
            coverUrl = await saveFile(coverFile, "covers");
        }
        if (audioFile) {
            audioUrl = await saveFile(audioFile, "audio");
        }

        // Database Transaction
        const updateTrack = db.transaction(() => {
            // 1. Update Track Table
            let updateQuery = `
                UPDATE tracks 
                SET title = @title, 
                    artist = @artist, 
                    bpm = @bpm, 
                    key = @key,
                    tags = @tags, 
                    genre = @genre, 
                    price = @price, 
                    duration = @duration,
                    updated_at = CURRENT_TIMESTAMP
            `;

            const params: any = {
                title, artist, bpm, key, tags, genre, price, duration, id
            };

            // Only update URLs if they are not null
            if (coverUrl !== null) {
                updateQuery += `, coverArtUrl = @coverArtUrl`;
                params.coverArtUrl = coverUrl;
            }

            if (audioUrl !== null) {
                updateQuery += `, audio_url = @audio_url`;
                params.audio_url = audioUrl;
            }

            updateQuery += ` WHERE id = @id`;

            db.prepare(updateQuery).run(params);

            // 2. Update Licenses
            if (licensesStr) {
                const licenses = JSON.parse(licensesStr); // [{type, price, features, ...}]

                // Get existing licenses for this track
                const existingLicenses = db.prepare("SELECT * FROM track_licenses WHERE trackId = ?").all(id) as any[];
                const dbLicenses = db.prepare("SELECT * FROM licenses").all() as any[];

                for (const lic of licenses) {
                    const existing = existingLicenses.find(l => l.licenseType === lic.type);

                    // Determine features
                    let featuresStr = "[]";
                    if (lic.features && Array.isArray(lic.features)) {
                        featuresStr = JSON.stringify(lic.features);
                    } else {
                        const defaultLic = dbLicenses.find(l => l.name === lic.type);
                        featuresStr = defaultLic ? defaultLic.features : "[]";
                    }

                    if (existing) {
                        db.prepare(`
                            UPDATE track_licenses 
                            SET price = @price, isActive = 1, contractFeatures = @features
                            WHERE id = @id
                        `).run({
                            price: lic.price,
                            features: featuresStr,
                            id: existing.id
                        });
                    } else {
                        db.prepare(`
                            INSERT INTO track_licenses (trackId, licenseType, price, isActive, contractFeatures)
                            VALUES (@trackId, @licenseType, @price, 1, @features)
                        `).run({
                            trackId: id,
                            licenseType: lic.type,
                            price: lic.price,
                            features: featuresStr
                        });
                    }
                }

                // Deactivate licenses not in the submitted list
                const submittedTypes = licenses.map((l: any) => l.type);
                if (submittedTypes.length > 0) {
                    const placeholders = submittedTypes.map(() => '?').join(',');
                    db.prepare(`UPDATE track_licenses SET isActive = 0 WHERE trackId = ? AND licenseType NOT IN (${placeholders})`).run(id, ...submittedTypes);
                } else {
                    db.prepare("UPDATE track_licenses SET isActive = 0 WHERE trackId = ?").run(id);
                }
            }
        });

        updateTrack();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error updating track:", error);
        return NextResponse.json({ error: `Failed to update track: ${error.message}` }, { status: 500 });
    }
}
