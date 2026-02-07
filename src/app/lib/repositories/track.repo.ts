import db from '../db'

export const getAllTracks = () => {
    const rows = db.prepare(`SELECT * FROM tracks ORDER BY created_at DESC`).all()
    const licenses = db.prepare(`SELECT * FROM track_licenses WHERE isActive = 1`).all()

    return rows.map((t: any) => {
        const trackLicenses = licenses.filter((l: any) => l.trackId === t.id);
        return {
            ...t,
            id: t.id,
            title: t.title,
            artist: t.artist,
            bpm: t.bpm,
            duration: t.duration, // Keep as number for now, format in UI
            tags: JSON.parse(t.tags || '[]'),
            cover: t.coverArtUrl || t.thumbnail_url, // Prefer coverArtUrl
            audioUrl: t.audio_url,
            price: t.price,
            featured: Boolean(t.featured),
            licenses: trackLicenses
        }
    })
}

// Helper to format seconds to MM:SS
function formatDuration(seconds: number) {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const createTrack = (data: any) => {
    return db.prepare(`
    INSERT INTO tracks
    (title, artist, bpm, duration, tags, thumbnail_url, audio_url, price, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        data.title,
        data.artist,
        data.bpm,
        data.duration,
        JSON.stringify(data.tags),
        data.cover,
        data.audioUrl,
        data.price,
        data.featured ? 1 : 0
    )
}
