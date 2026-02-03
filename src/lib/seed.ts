
import { createTrack, getAllTracks } from '../app/lib/repositories/track.repo';
import { TRACKS } from './data';
import db from '../app/lib/db';

async function seed() {
    console.log('Seeding database...');

    // Check if tracks exist
    const existing = getAllTracks();
    if (existing.length > 0) {
        console.log('Tracks already exist, skipping seed.');
        return;
    }

    // Insert tracks
    for (const track of TRACKS) {
        // Map data.ts structure to DB structure if consistent, or adjust
        // data.ts has: id, title, artist, bpm, duration, tags, cover, audioUrl, price
        // repo createTrack expects: title, artist, tags (array), price, audio_url, featured
        // We need to map 'cover' to 'thumbnail_url' and 'audioUrl' to 'audio_url'

        // Note: The repo doesn't seem to accept 'duration' (int) or 'thumbnail_url' in createTrack based on my previous view. This is a discrepancy.
        // Let's check repo again or update it. 
        // For now, I'll pass what I can.

        // Wait, looking at track.repo.ts viewed earlier:
        // INSERT INTO tracks (title, artist, tags, price, audio_url, featured)
        // It misses duration, bpm, thumbnail_url!

        // I should probably update the repo first to include all fields.
        // But for step 1, I will just follow the repo signature and maybe update repo later if needed.
        // Actually, if I don't save cover image, UI won't show it from DB.

        // Let's assume for this step I will update the repo as well implicitly or just use raw db.prepare here for full control?
        // Better to use a direct insert here to ensure all fields are matched.

        const stmt = db.prepare(`
            INSERT INTO tracks (title, artist, bpm, duration, tags, thumbnail_url, audio_url, price, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // duration in DB is INTEGER (seconds presumably?), data.ts has string "03:31".
        // simple helper to parse duration
        const parseDuration = (dur: string) => {
            const [m, s] = dur.split(':').map(Number);
            return m * 60 + s;
        };

        stmt.run(
            track.title,
            track.artist,
            track.bpm,
            parseDuration(track.duration),
            JSON.stringify(track.tags),
            track.cover,
            track.audioUrl,
            track.price,
            0 // featured
        );
        console.log(`Inserted: ${track.title}`);
    }

    console.log('Seeding complete.');
}

seed().catch(console.error);
