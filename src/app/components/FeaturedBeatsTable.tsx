"use client"
import { Search, Play, Download, Share2, Pause, ShoppingBag, ChevronDown } from "lucide-react";
import Image from "next/image";
import MediaPlayer from "./MediaPlayer";
import { usePlayerStore } from "@/stores/player.store";
import { useCartStore } from "@/stores/cart.store";

interface AllTracksProps {
    initialTracks: any[];
}

export default function FeaturedBeatsTable({ initialTracks }: AllTracksProps) {
    const { play, pause, currentTrack, isPlaying } = usePlayerStore();
    const { addItem } = useCartStore();

    // Use the passed tracks
    const tracks = initialTracks;

    const handlePlay = (track: any) => {
        if (currentTrack?.id === track.id && isPlaying) {
            pause();
        } else {
            play(track);
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
                                        <Image
                                            alt={track.title}
                                            width={48}
                                            height={48}
                                            className={`h-full w-full object-cover transition-transform duration-500 ${isTrackPlaying ? 'scale-110' : ''}`}
                                            src={track.cover}
                                        />
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
                                    <div className="w-20 text-sm text-white/50 font-medium tabular-nums hidden md:block">{track.duration}</div>
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
                                        <button className="h-9 w-9 items-center justify-center rounded bg-[#1A1A1A] text-white/70 hover:text-white hover:bg-[#252525] transition-all hidden md:flex">
                                            <Share2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => addItem({
                                                trackId: track.id,
                                                licenseId: 1,
                                                price: track.price,
                                                title: track.title,
                                                artist: track.artist,
                                                cover: track.cover,
                                                licenseName: "MP3 Lease"
                                            })}
                                            className="flex h-9 items-center gap-1.5 rounded bg-white px-4 text-xs font-bold text-black hover:bg-gray-200 transition-colors"
                                        >
                                            <ShoppingBag size={14} /> <span className="hidden md:inline">${track.price}</span><span className="md:hidden">${Math.floor(track.price)}</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
