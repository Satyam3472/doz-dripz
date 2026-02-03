import db from '../db'

export const getAllTracks = () => {
    const rows = db.prepare(`SELECT * FROM tracks`).all()
    return rows.map((t: any) => ({
        ...t,
        id: t.id,
        title: t.title,
        artist: t.artist,
        bpm: t.bpm,
        duration: formatDuration(t.duration), // Convert seconds back to MM:SS if needed, or handle in UI
        tags: JSON.parse(t.tags || '[]'),
        cover: t.thumbnail_url, // Map DB column to UI prop
        audioUrl: t.audio_url,
        price: t.price,
        featured: Boolean(t.featured),
    }))
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
