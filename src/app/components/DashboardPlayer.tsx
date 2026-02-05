
"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Repeat,
    Volume2,
    VolumeX,
    ListMusic,
    X
} from "lucide-react";
import { usePlayerStore } from "@/stores/player.store";

function formatTime(seconds: number) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function DashboardPlayer() {
    const {
        currentTrack,
        isPlaying,
        volume,
        isShuffle,
        repeatMode,
        play,
        pause,
        setVolume,
        playNext,
        playPrev,
        toggleShuffle,
        toggleRepeat,
        closePlayer
    } = usePlayerStore();

    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Audio Logic
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

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
        if (!currentTrack) return;
        if (isPlaying) pause();
        else play(currentTrack);
    };

    const handleEnded = () => {
        // Auto play next logic could trigger here via store, or just pause.
        // For queue, we want to play next automatically.
        playNext();
    };

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] h-24 bg-[#121212]/90 backdrop-blur-2xl border-t border-[#E11D48]/20 px-4 md:px-8 flex items-center justify-between transition-all shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
            <audio
                ref={audioRef}
                src={currentTrack.audioUrl || null}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            {/* Left: Track Info */}
            <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
                <div className="h-14 w-14 rounded-lg overflow-hidden border border-white/10 shadow-lg relative bg-black">
                    {currentTrack.cover ? (
                        <Image
                            src={currentTrack.cover}
                            alt={currentTrack.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-800" />
                    )}
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-black uppercase tracking-widest text-white truncate">{currentTrack.title}</h4>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter truncate">{currentTrack.artist || "DOZ DRIPZ"}</p>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="hidden md:flex flex-col items-center gap-2 w-2/4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleShuffle}
                        className={`transition-colors ${isShuffle ? 'text-[#E11D48]' : 'text-white/40 hover:text-[#E11D48]'}`}
                    >
                        <Shuffle size={20} />
                    </button>
                    <button
                        onClick={playPrev}
                        className="text-white hover:text-[#E11D48] transition-colors"
                    >
                        <SkipBack size={24} className="fill-current" />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="h-12 w-12 rounded-full bg-[#E11D48] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all"
                    >
                        {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                    </button>
                    <button
                        onClick={playNext}
                        className="text-white hover:text-[#E11D48] transition-colors"
                    >
                        <SkipForward size={24} className="fill-current" />
                    </button>
                    <button
                        onClick={toggleRepeat}
                        className={`transition-colors ${repeatMode !== 'none' ? 'text-[#E11D48]' : 'text-white/40 hover:text-[#E11D48]'}`}
                        title={`Repeat: ${repeatMode}`}
                    >
                        <Repeat size={20} />
                        {repeatMode === 'one' && <span className="absolute text-[8px] font-bold text-[#E11D48] ml-3 -mt-2">1</span>}
                    </button>
                </div>

                <div className="w-full max-w-lg flex items-center gap-3">
                    <span className="text-[10px] font-bold text-white/30 tabular-nums w-8 text-right">{formatTime(currentTime)}</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
                        {/* Progress Input Overlay */}
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                        />
                        {/* Visual Bar */}
                        <div
                            className="absolute inset-y-0 left-0 bg-[#E11D48] rounded-full shadow-[0_0_8px_rgba(225,29,72,0.5)] pointer-events-none"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                        <div
                            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform pointer-events-none"
                            style={{ left: `${(currentTime / duration) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-[10px] font-bold text-white/30 tabular-nums w-8">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Mobile Play Button Replacement for Center */}
            <div className="md:hidden flex items-center gap-4">
                <button
                    onClick={togglePlay}
                    className="h-10 w-10 rounded-full bg-[#E11D48] flex items-center justify-center text-white shadow-lg"
                >
                    {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
                </button>
                <button onClick={closePlayer} className="text-white/40 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            {/* Right: Volume & Actions */}
            <div className="hidden md:flex items-center justify-end gap-6 w-1/4">
                <div className="flex items-center gap-3 group">
                    <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-white/40 hover:text-white transition-colors">
                        {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                        className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E11D48] hover:bg-white/20"
                        max="1"
                        min="0"
                        step="0.01"
                        type="range"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                    />
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                    <ListMusic size={20} />
                </button>
                <button
                    onClick={closePlayer}
                    className="text-white/40 hover:text-white transition-colors"
                    title="Close Player"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
