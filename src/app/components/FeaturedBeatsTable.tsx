"use client"
import { Search, Play, Download, Share2, Pause, ShoppingBag, ChevronDown, Plus, CirclePlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import MediaPlayer from "./MediaPlayer";
import LicensingModal from "./LicensingModal";
import { usePlayerStore } from "@/stores/player.store";
import { useCartStore } from "@/stores/cart.store";
import { formatDuration } from "@/app/lib/utils";

interface AllTracksProps {
    initialTracks: any[];
}

export default function FeaturedBeatsTable({ initialTracks }: AllTracksProps) {
    const { play, pause, currentTrack, isPlaying } = usePlayerStore();
    const { addItem } = useCartStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any>(null);

    // Use the passed tracks
    const tracks = initialTracks;

    const handlePlay = (track: any) => {
        if (currentTrack?.id === track.id && isPlaying) {
            pause();
        } else {
            play(track);
        }
    };

    const openLicensingModal = (track: any) => {
        setSelectedTrack(track);
        setModalOpen(true);
    };

    const handleShare = async (track: any) => {
        const shareUrl = `${window.location.origin}/track/${track.id}`;
        const shareData = {
            title: track.title,
            text: `Check out ${track.title} by ${track.artist} on DOZ DRIPZ`,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    return (
        <div className="text-white w-full">
            <section className="mx-auto">
                <div className="rounded-xl border border-white/5 bg-[#0a0a0a]">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-white/5 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 md:grid-cols-[auto_1fr_auto_auto_auto_auto] md:gap-4 md:px-6">
                        <div className="w-12"></div> {/* Cover placeholder */}
                        <div>Title</div>
                        <div className="hidden w-20 md:block">Time</div>
                        <div className="hidden w-16 md:block">BPM</div>
                        <div className="hidden w-48 md:block">Tags</div>
                        <div className="w-auto text-right md:w-48">Actions</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {tracks.map((track) => {
                            const isCurrent = currentTrack?.id === track.id;
                            const isTrackPlaying = isCurrent && isPlaying;

                            return (
                                <div key={track.id} className={`group grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02] md:grid-cols-[auto_1fr_auto_auto_auto_auto] md:gap-4 md:px-6 ${isCurrent ? 'bg-white/[0.04]' : ''}`}>
                                    <div className="group/cover relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
                                        {(track.coverArtUrl || track.thumbnail_url) && <Image src={track.coverArtUrl || track.thumbnail_url} alt={track.title} fill className={`h-full w-full object-cover transition-transform duration-500 ${isTrackPlaying ? 'scale-110' : ''}`} />}
                                        {(!track.coverArtUrl && !track.thumbnail_url) && <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-white/20">?</div>}
                                        <div
                                            onClick={() => handlePlay(track)}
                                            className={`cursor-pointer absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover/cover:opacity-100'}`}
                                        >
                                            {isTrackPlaying ? (
                                                <Pause className="fill-white text-white" size={20} />
                                            ) : (
                                                <Play className="fill-white text-white" size={20} />
                                            )}
                                        </div>
                                    </div>
                                    <div onClick={() => handlePlay(track)} className="min-w-0 cursor-pointer">
                                        <div className={`truncate text-sm font-bold tracking-tight transition-colors ${isCurrent ? 'text-doz-red' : 'text-white group-hover:text-doz-red'}`}>
                                            {track.title}
                                        </div>
                                        <div className="truncate text-xs text-white/50 md:hidden">{track.artist}</div>
                                    </div>
                                    <div className="w-20 text-sm text-white/50 font-medium tabular-nums hidden md:block">{formatDuration(track.duration)}</div>
                                    <div className="w-16 text-sm text-white/50 font-medium tabular-nums hidden md:block">{track.bpm}</div>
                                    <div className="w-48 flex-wrap gap-2 hidden md:flex">
                                        {track.tags.map((tag: any) => (
                                            <span key={tag} className="px-3 py-1 text-[10px] font-bold rounded-full bg-[#1A1A1A] text-white/60 uppercase tracking-wide hover:bg-[#252525] transition-colors cursor-pointer">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="w-auto md:w-48 flex items-center justify-end gap-2">
                                        <button className="h-9 w-9 flex items-center justify-center rounded bg-[#1A1A1A] text-white/70 hover:text-white hover:bg-[#252525] transition-all">
                                            <Download size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleShare(track)}
                                            className="h-9 w-9 items-center justify-center rounded bg-[#1A1A1A] text-white/70 hover:text-white hover:bg-[#252525] transition-all hidden md:flex"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => openLicensingModal(track)}
                                            className="flex h-9 w-24 md:w-28 items-center justify-center gap-2 rounded bg-white px-2 text-xs font-bold text-black hover:bg-gray-200 transition-colors"
                                        >
                                            <div className="relative">
                                                <ShoppingBag size={16} />
                                                <span className="absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-doz-red text-[10px] font-bold text-white">
                                                    <CirclePlus size={10} className="text-white" strokeWidth={3} />
                                                </span>
                                            </div>
                                            <span>₹{Math.floor(track.price)}</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <LicensingModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                track={selectedTrack}
            />
        </div>
    );
}
