
import { createTrack, getAllTracks } from '../app/lib/repositories/track.repo';
import { TRACKS } from './data';
import db from '../app/lib/db';

async function seed() {
    console.log('Seeding database...');

    // Check if tracks exist
    const existingTracks = getAllTracks();
    if (existingTracks.length === 0) {
        console.log('Seeding tracks...');
        // Insert tracks
        for (const track of TRACKS) {
            const stmt = db.prepare(`
                INSERT INTO tracks (title, artist, bpm, duration, tags, thumbnail_url, audio_url, price, featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

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
            console.log(`Inserted track: ${track.title}`);
        }
    } else {
        console.log('Tracks already exist, skipping track seed.');
    }

    // Seed Licenses
    const existingLicenses = db.prepare('SELECT count(*) as count FROM licenses').get() as { count: number };
    if (existingLicenses.count === 0) {
        console.log('Seeding licenses...');
        const licenses = [
            {
                id: 1,
                name: "Standard Lease",
                price: 29.99,
                type: "Non-Exclusive",
                features: ["MP3 & WAV", "Used for Music Recording", "Distribute up to 2,000 copies", "500,000 Online Audio Streams", "1 Music Video"],
                bulk_deals: []
            },
            {
                id: 2,
                name: "Premium Lease",
                price: 99.99,
                type: "Non-Exclusive",
                features: ["STEMS, MP3 & WAV", "Unlimited Recording", "Unlimited Distribution", "Unlimited Streams", "Radio Broadcasting"],
                bulk_deals: []
            }
        ];

        const insertLicense = db.prepare(`
            INSERT INTO licenses (id, name, price, type, features, bulk_deals)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const lic of licenses) {
            insertLicense.run(
                lic.id,
                lic.name,
                lic.price,
                lic.type,
                JSON.stringify(lic.features),
                JSON.stringify(lic.bulk_deals)
            );
            console.log(`Inserted license: ${lic.name}`);
        }
    } else {
        console.log('Licenses already exist, skipping license seed.');
    }

    console.log('Seeding complete.');
}

seed().catch(console.error);
