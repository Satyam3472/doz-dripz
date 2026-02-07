
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

// Helper to save file
async function saveFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    const ext = path.extname(file.name);
    const filename = `${crypto.randomUUID()}${ext}`;
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

        const licenses = db.prepare("SELECT * FROM track_licenses WHERE trackId = ?").all(id);
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

        // New Logic: Check for direct URL string OR File
        const audioUrlInput = formData.get("audioUrl") as string;

        const coverFile = formData.get("cover") as File | null;
        const audioFile = formData.get("audio") as File | null;

        // 1. Handle File Saves First
        let coverUrl: string | undefined;
        let audioUrl: string | undefined;

        if (coverFile) {
            coverUrl = await saveFile(coverFile, "covers");
        }

        if (audioFile) {
            audioUrl = await saveFile(audioFile, "audio");
        } else if (audioUrlInput) {
            audioUrl = audioUrlInput;
        }

        // 2. Database Transaction
        const updateTx = db.transaction(() => {
            // Update Basic Info
            db.prepare(`
                UPDATE tracks 
                SET title = @title, bpm = @bpm, tags = @tags, genre = @genre, updated_at = CURRENT_TIMESTAMP
                WHERE id = @id
            `).run({ title, bpm, tags, genre, id });

            // Update URLs only if they changed
            if (coverUrl) {
                db.prepare("UPDATE tracks SET coverArtUrl = ? WHERE id = ?").run(coverUrl, id);
            }
            if (audioUrl) {
                db.prepare("UPDATE tracks SET audio_url = ? WHERE id = ?").run(audioUrl, id);
            }

            // Update Licenses
            if (licensesStr) {
                const licenses = JSON.parse(licensesStr);
                const dbLicenses = db.prepare("SELECT * FROM licenses").all() as any[];

                for (const lic of licenses) {
                    const existing = db.prepare("SELECT id FROM track_licenses WHERE trackId = ? AND licenseType = ?").get(id, lic.type) as any;

                    if (existing) {
                        db.prepare("UPDATE track_licenses SET price = ?, isActive = 1 WHERE id = ?").run(lic.price, existing.id);
                    } else {
                        const defaultLic = dbLicenses.find(l => l.name === lic.type);
                        const features = defaultLic ? defaultLic.features : "[]";
                        db.prepare(`
                            INSERT INTO track_licenses (trackId, licenseType, price, isActive, contractFeatures)
                            VALUES (@trackId, @licenseType, @price, 1, @contractFeatures)
                        `).run({ trackId: id, licenseType: lic.type, price: lic.price, contractFeatures: features });
                    }
                }

                // Deactivate others
                const activeTypes = licenses.map((l: any) => l.type);
                if (activeTypes.length > 0) {
                    const placeholders = activeTypes.map(() => '?').join(',');
                    db.prepare(`UPDATE track_licenses SET isActive = 0 WHERE trackId = ? AND licenseType NOT IN (${placeholders})`).run(id, ...activeTypes);
                } else {
                    db.prepare("UPDATE track_licenses SET isActive = 0 WHERE trackId = ?").run(id);
                }
            }
        });

        updateTx();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
