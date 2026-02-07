"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDuration } from "@/app/lib/utils";
import {
    Play,
    Pause,
    ShoppingBag,
    ShoppingCart,
    Heart,
    Share2,
    Download,
    ArrowRight,
    Mic,
    Music // For 'artist' icon fallback
} from "lucide-react";
import { usePlayerStore } from "@/stores/player.store";
import { useCartStore } from "@/stores/cart.store";

// Helper to fetch track (Mocking for now since we don't have slugs)
// In a real app, this would be a Server Component fetching from DB
// But since we need to use client-side stores (player/cart), we might stick to Client Component for interactivity
// or use a Server Component for data and Client for interactivity.
// Given the rich interactivity (play, cart), Client Component is easier for MVP.

export default function TrackDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;

    // Decode slug to title (assuming slug is title-like)
    // In reality, we should fetch by ID or Slug from DB.
    // For MVP, let's fetch all tracks and find match or just show a specific one.

    const [track, setTrack] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [relatedTracks, setRelatedTracks] = useState<any[]>([]);

    const { play, pause, currentTrack, isPlaying } = usePlayerStore();
    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await fetch('/api/admin/tracks');
                const tracks = await res.json();

                // Simple logic: find track where title roughly matches slug or ID
                // If slug is numeric, check ID. Else check title.
                let found = null;
                if (!isNaN(Number(slug))) {
                    found = tracks.find((t: any) => t.id === Number(slug));
                } else {
                    const decodedSlug = decodeURIComponent(slug).replace(/-/g, ' ').toLowerCase();
                    found = tracks.find((t: any) => t.title.toLowerCase() === decodedSlug);
                }

                // If not found, just take the first one for demo if user clicked "View All" or something random
                // OR show 404. Let's fallback to first track to ensure page renders something for the user to see the design.
                if (!found && tracks.length > 0) found = tracks[0];

                setTrack(found);

                // Related: just other tracks
                if (tracks.length > 0) {
                    setRelatedTracks(tracks.filter((t: any) => t.id !== found?.id).slice(0, 3)); // Top 3
                }
            } catch (error) {
                console.error("Failed to fetch tracks", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">Loading...</div>;
    if (!track) return <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">Track not found.</div>;

    const isCurrent = currentTrack?.id === track.id;
    const isTrackPlaying = isCurrent && isPlaying;

    const handlePlay = (t: any) => {
        if (currentTrack?.id === t.id && isPlaying) {
            pause();
        } else {
            play(t);
        }
    };

    return (
        <main className="bg-background-dark min-h-screen text-white font-display">
            {/* Nav is handled by Global Layout, but user provided specific Nav. 
                We will render the content inside the global layout. 
                The user's HTML 'nav' is very similar to standard, just transparent. 
                We'll trust the global nav for now or hide it if we could? 
                Let's just render the 'main' section interactions. 
            */}

            <section className="relative bg-gradient-to-b from-charcoal-light to-background-dark pt-12 pb-8 border-b border-white/5">
                <div className="mx-auto max-w-[1200px] px-6">
                    <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                        {/* Artwork */}
                        <div className="relative w-full md:w-[400px] aspect-square rounded-2xl overflow-hidden shadow-2xl group shadow-brand-red/10">
                            {track.coverArtUrl || track.thumbnail_url ? (
                                <Image
                                    src={track.coverArtUrl || track.thumbnail_url}
                                    alt={track.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white/20">No Cover</div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handlePlay(track)}
                                    className="h-20 w-20 flex items-center justify-center rounded-full bg-brand-red text-white shadow-2xl scale-90 group-hover:scale-100 transition-transform"
                                >
                                    {isTrackPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                                </button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 text-[10px] font-black bg-brand-red/20 text-brand-red rounded-full uppercase tracking-widest border border-brand-red/30">Premium Beat</span>
                                    <span className="px-3 py-1 text-[10px] font-black bg-white/5 text-white/60 rounded-full uppercase tracking-widest border border-white/10">Exclusive Available</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">{track.title}</h2>
                                <p className="text-xl font-bold text-brand-red flex items-center gap-2">
                                    <Mic size={24} className="text-brand-red" />
                                    PRODUCED BY {track.artist}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="bg-charcoal-light/50 border border-white/5 px-4 py-3 rounded-xl min-w-[100px]">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Time</p>
                                    <p className="text-xl font-bold">{formatDuration(track.duration)}</p>
                                </div>
                                <div className="bg-charcoal-light/50 border border-white/5 px-4 py-3 rounded-xl min-w-[100px]">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">BPM</p>
                                    <p className="text-xl font-bold">{track.bpm || 'N/A'}</p>
                                </div>
                                <div className="bg-charcoal-light/50 border border-white/5 px-4 py-3 rounded-xl min-w-[100px]">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Genre</p>
                                    <p className="text-xl font-bold">{track.genre || 'Hip Hop'}</p>
                                </div>
                                <div className="bg-charcoal-light/50 border border-white/5 px-4 py-3 rounded-xl min-w-[100px]">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Mood</p>
                                    <p className="text-xl font-bold uppercase text-sm">
                                        {track.tags ? JSON.parse(track.tags).slice(0, 2).join(" / ") : "Dark / Hype"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <button
                                    onClick={() => addItem({ ...track, licenseId: 'basic', price: track.price, licenseName: 'Standard' })}
                                    className="flex-1 md:flex-none px-10 py-4 bg-brand-red hover:brightness-110 text-white font-black text-lg uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_30px_rgba(227,27,35,0.3)] flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={24} />
                                    BUY NOW ₹{track.price}
                                </button>
                                <button
                                    onClick={() => addItem({ ...track, licenseId: 'basic', price: track.price, licenseName: 'Standard' })}
                                    className="flex-1 md:flex-none px-10 py-4 bg-white/10 hover:bg-white/15 text-white font-black text-lg uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={24} />
                                    ADD TO CART
                                </button>
                            </div>

                            <div className="flex items-center gap-6 pt-4 text-white/40">
                                <button className="flex items-center gap-2 hover:text-brand-red transition-colors font-bold text-xs uppercase tracking-widest">
                                    <Heart size={20} />
                                    Add to Favorites
                                </button>
                                <button className="flex items-center gap-2 hover:text-brand-red transition-colors font-bold text-xs uppercase tracking-widest">
                                    <Share2 size={20} />
                                    Share Track
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Waveform Visualization (Static for now, but animated CSS) */}
                    <div className="mt-16 w-full space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40 px-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handlePlay(track)}
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-red text-white"
                                >
                                    {isTrackPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                </button>
                                <span>{isTrackPlaying ? "PLAYING" : "PREVIEW"}</span>
                            </div>
                            <span>PREVIEW ONLY</span>
                        </div>
                        <div className="relative h-24 w-full flex items-end gap-[2px]">
                            {/* Generate random bars for visual effect */}
                            {Array.from({ length: 60 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`waveform-bar ${isTrackPlaying ? 'infinite-animate' : ''} ${i % 3 === 0 ? 'active' : ''}`} // Logic simplification for visual
                                    style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommended Tracks */}
            <section className="mx-auto max-w-[1200px] px-6 py-20">
                <div className="mb-10 flex items-end justify-between border-b border-white/5 pb-4">
                    <h3 className="text-3xl font-black uppercase tracking-tight">
                        Recommended <span className="text-brand-red text-glow-red">Tracks</span>
                    </h3>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-brand-red transition-colors flex items-center gap-2 cursor-pointer">
                        View All Tracks
                        <ArrowRight size={16} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-[10px] font-black uppercase tracking-widest text-white/30 px-4">
                                <th className="pb-2 pl-4">Title</th>
                                <th className="pb-2">Time</th>
                                <th className="pb-2">BPM</th>
                                <th className="pb-2">Tags</th>
                                <th className="pb-2 text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-4">
                            {relatedTracks.map((relTrack) => {
                                const isRelPlaying = currentTrack?.id === relTrack.id && isPlaying;
                                return (
                                    <tr key={relTrack.id} className="group bg-card-dark hover:bg-charcoal-light transition-all rounded-xl border border-transparent hover:border-brand-red/20">
                                        <td className="py-4 pl-4 rounded-l-xl">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
                                                    {(relTrack.coverArtUrl || relTrack.thumbnail_url) && (
                                                        <Image src={relTrack.coverArtUrl || relTrack.thumbnail_url} alt={relTrack.title} fill className="object-cover" />
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handlePlay(relTrack)}>
                                                        {isRelPlaying ? <Pause size={24} className="fill-white text-white" /> : <Play size={24} className="fill-white text-white" />}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm group-hover:text-brand-red transition-colors cursor-pointer">
                                                        <Link href={`/track/${relTrack.id}`}>{relTrack.title}</Link>
                                                    </div>
                                                    <div className="text-[10px] font-medium text-brand-red/80 uppercase">{relTrack.artist}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-white/60 tabular-nums">{formatDuration(relTrack.duration)}</td>
                                        <td className="py-4 text-sm text-white/60 tabular-nums">{relTrack.bpm}</td>
                                        <td className="py-4">
                                            <div className="flex gap-2">
                                                {relTrack.tags && JSON.parse(relTrack.tags).slice(0, 2).map((t: string) => (
                                                    <span key={t} className="px-3 py-1 text-[10px] font-bold rounded-full bg-white/5 text-white/50 border border-white/10 uppercase tracking-tighter">{t}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4 text-right rounded-r-xl">
                                            <div className="flex items-center justify-end gap-3">
                                                <button className="p-2 text-white/40 hover:text-brand-red transition-colors"><Download size={20} /></button>
                                                <button
                                                    onClick={() => addItem({ ...relTrack, licenseId: 'basic', price: relTrack.price, licenseName: 'Standard' })}
                                                    className="ml-2 bg-brand-red text-white font-black text-xs px-5 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-brand-red/20"
                                                >
                                                    ₹{relTrack.price}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
