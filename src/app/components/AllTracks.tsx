"use client"
import { Search, Play, Download, Share2, Pause, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import MediaPlayer from "./MediaPlayer";
import LicensingModal from "./LicensingModal";
import { usePlayerStore } from "@/stores/player.store";
import { useCartStore } from "@/stores/cart.store";

interface AllTracksProps {
    initialTracks: any[];
}

export default function TracksPage({ initialTracks }: AllTracksProps) {
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

    return (
        <div className="min-h-screen bg-black text-white pb-4">
            <section className="relative flex min-h-[40vh] flex-col items-center justify-center overflow-hidden px-6 py-12">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-doz-red/5 via-transparent to-transparent " />
                <div className="relative z-10 flex w-full max-w-[960px] flex-col items-center gap-6 text-center">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-4xl">
                            LICENSING <span className="text-doz-red">TRACKS</span>
                        </h1>
                        <p className="mx-auto max-w-xl text-sm text-white/70">
                            Explore our latest catalogue of premium beats.
                        </p>
                    </div>
                    <MediaPlayer />
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 p-4">
                    <div className="flex flex-wrap items-center gap-8">
                        <div className="relative group">
                            <select className="appearance-none bg-transparent text-sm font-bold uppercase tracking-wider text-white/50 focus:ring-0 cursor-pointer hover:text-white transition-colors outline-none pr-4">
                                <option className="bg-[#121212] text-white" value="all">All Genre</option>
                                <option className="bg-[#121212] text-white" value="trap">Trap</option>
                                <option className="bg-[#121212] text-white" value="drill">Drill</option>
                                <option className="bg-[#121212] text-white" value="rnb">R&B</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <select className="appearance-none bg-transparent text-sm font-bold uppercase tracking-wider text-white/50 focus:ring-0 cursor-pointer hover:text-white transition-colors outline-none pr-4">
                                <option className="bg-[#121212] text-white" value="any">All BPM</option>
                                <option className="bg-[#121212] text-white" value="low">70 - 100</option>
                                <option className="bg-[#121212] text-white" value="mid">100 - 140</option>
                                <option className="bg-[#121212] text-white" value="high">140+</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <select className="appearance-none bg-transparent text-sm font-bold uppercase tracking-wider text-white/50 focus:ring-0 cursor-pointer hover:text-white transition-colors outline-none pr-4">
                                <option className="bg-[#121212] text-white" value="any">All Mood</option>
                                <option className="bg-[#121212] text-white" value="dark">Dark</option>
                                <option className="bg-[#121212] text-white" value="hype">Hype</option>
                                <option className="bg-[#121212] text-white" value="chill">Chill</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-[300px] items-center rounded-lg bg-[#121212] border border-white/5 px-3 focus-within:border-white/20 transition-colors">
                            <Search size={16} className="text-white/30 mr-2" />
                            <input
                                className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-white/30 text-sm outline-none"
                                placeholder="Search..."
                                type="text"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#0a0a0a]">
                    <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 border-b border-white/5 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <div className="w-12"></div> {/* Cover placeholder */}
                        <div>Title</div>
                        <div className="w-20 hidden md:block">Time</div>
                        <div className="w-16 hidden md:block">BPM</div>
                        <div className="w-48 hidden md:block">Tags</div>
                        <div className="w-auto md:w-48 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-white/5 mb-4">
                        {tracks.map((track) => {
                            const isCurrent = currentTrack?.id === track.id;
                            const isTrackPlaying = isCurrent && isPlaying;

                            return (
                                <div key={track.id} className={`group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors ${isCurrent ? 'bg-white/[0.04]' : ''}`}>
                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 group/cover">
                                        <Image
                                            alt={track.title}
                                            width={48}
                                            height={48}
                                            className={`h-full w-full object-cover transition-transform duration-500 ${isTrackPlaying ? 'scale-110' : ''}`}
                                            src={track.cover}
                                        />
                                        <div
                                            onClick={() => handlePlay(track)}
                                            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity cursor-pointer ${isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover/cover:opacity-100'}`}
                                        >
                                            {isTrackPlaying ? (
                                                <Pause className="text-white fill-white" size={20} />
                                            ) : (
                                                <Play className="text-white fill-white" size={20} />
                                            )}
                                        </div>
                                    </div>
                                    <div onClick={() => handlePlay(track)} className="cursor-pointer">
                                        <div className={`font-bold text-sm tracking-tight transition-colors ${isCurrent ? 'text-doz-red' : 'text-white group-hover:text-doz-red'}`}>
                                            {track.title}
                                        </div>
                                        <div className="md:hidden text-xs text-white/50">{track.artist}</div>
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
                                            onClick={() => openLicensingModal(track)}
                                            className="flex h-9 items-center gap-1.5 rounded bg-white px-4 text-xs font-bold text-black hover:bg-gray-200 transition-colors"
                                        >
                                            <ShoppingBag size={14} /> <span className="hidden md:inline">₹{track.price}</span><span className="md:hidden">₹{Math.floor(track.price)}</span>
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
