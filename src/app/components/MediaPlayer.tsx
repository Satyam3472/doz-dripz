"use client"
import { Play, Pause, SkipForward, SkipBack, Volume2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/stores/player.store";
import { useCartStore } from "@/stores/cart.store";

function formatTime(seconds: number) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function MediaPlayer() {
    const { currentTrack, isPlaying, volume, play, pause, setVolume } = usePlayerStore();
    const { addItem } = useCartStore();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Sync Audio Element with Store State
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]); // Re-run when track changes or play state changes

    // Update Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const togglePlay = () => {
        if (currentTrack) {
            if (isPlaying) {
                pause();
            } else {
                play(currentTrack);
            }
        }
    };

    const handleEnded = () => {
        pause();
        setCurrentTime(0);
    };

    if (!currentTrack) {
        return (
            <div className={`mb-0 flex h-8 w-full max-w-2xl items-end justify-center gap-1.5 px-4 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}>
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 rounded-full bg-doz-red transition-all duration-300 ${isPlaying ? 'animate-wave' : ''}`}
                        style={{
                            height: `${Math.random() * 60 + 20}%`,
                            animationDelay: `${Math.random() * 0.5}s`
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="relative z-10 flex w-full max-w-[960px] flex-col items-center gap-6 text-center transition-all duration-500 will-change-transform">
            <audio
                ref={audioRef}
                src={currentTrack.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            {/* Waveform Animation (Only acts if playing) */}
            <div className={`mb-0 flex h-8 w-full max-w-2xl items-end justify-center gap-1.5 px-4 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}>
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 rounded-full bg-doz-red transition-all duration-300 ${isPlaying ? 'animate-wave' : ''}`}
                        style={{
                            height: `${Math.random() * 60 + 20}%`,
                            animationDelay: `${Math.random() * 0.5}s`
                        }}
                    />
                ))}
            </div>

            {/* Player UI */}
            <div className="relative flex w-full max-w-4xl flex-col gap-3 rounded-2xl border border-white/5 bg-[#121212] p-3 shadow-2xl backdrop-blur-sm md:flex-row md:items-center md:justify-between md:gap-6 md:p-4">

                {/* Top Section: Info & Mobile Controls */}
                <div className="flex w-full items-center justify-between gap-3 md:w-auto">
                    {/* Track Info */}
                    <div className="flex min-w-0 flex-1 items-center gap-3 md:min-w-[180px]">
                        <div
                            className="h-10 w-10 flex-shrink-0 rounded-lg border border-white/5 bg-cover bg-center shadow-lg md:h-12 md:w-12 relative overflow-hidden"
                        >
                            <Image
                                src={currentTrack.cover}
                                alt={currentTrack.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                            <h4 className="truncate text-sm font-bold tracking-tight text-white">
                                {currentTrack.title}
                            </h4>
                            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-doz-red">
                                {currentTrack.artist}
                            </p>
                        </div>
                    </div>

                    {/* Mobile Only Controls */}
                    <div className="flex items-center gap-3 md:hidden">
                        <button
                            onClick={togglePlay}
                            className="flex h-9 w-9 transform items-center justify-center rounded-full bg-doz-red text-white shadow-lg shadow-doz-red/20 transition-all hover:scale-110 active:scale-95"
                        >
                            {isPlaying ? (
                                <Pause className="h-4 w-4 fill-current" />
                            ) : (
                                <Play className="ml-0.5 h-4 w-4 fill-current" />
                            )}
                        </button>

                        <button
                            onClick={() => addItem({
                                trackId: currentTrack.id,
                                licenseId: 1,
                                price: currentTrack.price,
                                title: currentTrack.title,
                                artist: currentTrack.artist,
                                cover: currentTrack.cover,
                                licenseName: "MP3 Lease"
                            })}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black transition-all hover:bg-gray-200 active:scale-95"
                        >
                            <ShoppingBag className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Progress & Desktop Controls */}
                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-1">
                    {/* Desktop Play Controls */}
                    <div className="hidden items-center justify-center gap-6 text-slate-400 md:flex">
                        <button className="transition-colors hover:text-white">
                            <SkipBack className="h-5 w-5" />
                        </button>
                        <button
                            onClick={togglePlay}
                            className="flex h-10 w-10 transform items-center justify-center rounded-full bg-doz-red text-white shadow-lg shadow-doz-red/20 transition-all hover:scale-110 active:scale-95"
                        >
                            {isPlaying ? (
                                <Pause className="h-5 w-5 fill-current" />
                            ) : (
                                <Play className="ml-0.5 h-5 w-5 fill-current" />
                            )}
                        </button>
                        <button className="transition-colors hover:text-white">
                            <SkipForward className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Scrubber */}
                    <div className="flex items-center gap-3 w-full">
                        <span className="hidden w-8 text-right text-[10px] font-medium text-slate-400 md:block">
                            {formatTime(currentTime)}
                        </span>
                        <div className="relative h-1.5 flex-1 cursor-pointer group">
                            <div className="absolute inset-0 rounded-full bg-white/10"></div>
                            <div
                                className="absolute left-0 top-0 h-full rounded-full bg-doz-red relative"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            >
                                <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 scale-0 rounded-full bg-white shadow-md transition-transform group-hover:scale-100"></div>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                        </div>
                        <span className="hidden w-8 text-[10px] font-medium text-slate-400 md:block">
                            {formatTime(duration)}
                        </span>
                    </div>
                    {/* Mobile Time Display (Optional, can hide to save space or put below) */}
                    <div className="flex justify-between md:hidden px-1">
                        <span className="text-[9px] font-medium text-slate-500">{formatTime(currentTime)}</span>
                        <span className="text-[9px] font-medium text-slate-500">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Desktop Volume & Actions */}
                <div className="hidden items-center justify-end gap-4 md:flex md:w-auto">
                    <div className="group relative flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-slate-400 transition-colors group-hover:text-white" />
                        <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full bg-slate-400 transition-colors group-hover:bg-white"
                                style={{ width: `${volume * 100}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => addItem({
                            trackId: currentTrack.id,
                            licenseId: 1,
                            price: currentTrack.price,
                            title: currentTrack.title,
                            artist: currentTrack.artist,
                            cover: currentTrack.cover,
                            licenseName: "MP3 Lease"
                        })}
                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:scale-105 hover:bg-gray-200 active:scale-95 shadow-lg"
                    >
                        <ShoppingBag className="h-3 w-3" /> <span className="hidden lg:inline">${currentTrack.price}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}