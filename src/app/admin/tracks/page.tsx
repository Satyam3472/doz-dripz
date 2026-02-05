"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, MoreVertical, Search } from "lucide-react";

export default function AdminTracksPage() {
    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            const res = await fetch("/api/admin/tracks");
            const data = await res.json();
            if (data.tracks) setTracks(data.tracks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Manage Beats</h1>
                    <p className="text-[#A3A3A3] text-sm font-bold uppercase tracking-widest">{tracks.length} Total Uploads</p>
                </div>
                <Link
                    href="/admin/tracks/new"
                    className="bg-[#EC1313] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(236,19,19,0.3)]"
                >
                    <Plus size={20} /> Upload Track
                </Link>
            </div>

            {/* Tracks List */}
            <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#A3A3A3]">
                        <tr>
                            <th className="px-6 py-4">Track</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Metadata</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                        {tracks.map(track => (
                            <tr key={track.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-zinc-800 relative overflow-hidden flex-shrink-0 border border-white/5">
                                            {track.thumbnail_url && <Image src={track.thumbnail_url} alt={track.title} fill className="object-cover" />}
                                            {!track.thumbnail_url && <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-white/20">?</div>}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm">{track.title}</h3>
                                            <p className="text-xs text-[#A3A3A3] font-bold tracking-wide">{track.artist}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${track.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {track.status || 'ACTIVE'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 text-xs text-[#A3A3A3] font-bold">
                                        <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{track.bpm || '-'} BPM</span>
                                        <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{track.key || '-'} Key</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-[#A3A3A3] font-medium">
                                    {new Date(track.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[#A3A3A3] hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tracks.length === 0 && !loading && (
                    <div className="p-12 text-center text-[#A3A3A3]">
                        <p>No tracks found. Upload your first beat!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
