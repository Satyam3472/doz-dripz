"use client";
import React from "react";
import Image from "next/image";
import { Disc, Sliders, AudioWaveform, Brush, PlayCircle, Mic, Share2 } from "lucide-react";
import profile from "../assets/profile.jpg";

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-background-dark text-white pb-20">
            <section className="relative mx-auto max-w-[1200px] px-6 py-24">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-7 space-y-16">
                        {/* Header Section */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Industry Leader
                            </div>
                            <h2 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-tight lg:text-7xl">
                                The Sound of <br />
                                <span className="text-primary drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                    Tomorrow.
                                </span>
                            </h2>
                            <div className="max-w-2xl space-y-6 text-xl leading-relaxed text-slate-400 font-light">
                                <p>
                                    Gold Doz is more than a producer; he is an architect of atmosphere. Specializing in high-end hip-hop and avant-garde soundscapes, he bridges the gap between raw street energy and polished studio perfection.
                                </p>
                                <p>
                                    With a decade of sonic exploration, Gold has established <strong>DOZ DRIPZ</strong> as the premier destination for artists seeking that elusive &quot;it&quot; factor. His production is characterized by heavy bass, ethereal textures, and a relentless focus on rhythmic innovation.
                                </p>
                            </div>
                        </div>

                        {/* Streaming Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Streaming On</h3>
                            <div className="flex flex-wrap items-center gap-10 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                                {/* Using placeholder images or SVGs usually, sticking to img tags for transparency if available, otherwise just text/icons */}
                                {/* Since the data URIs were long, I will substitute with simple text or generic icons for now to keep it clean, or try to render something simple. 
                                    Actually, I'll use simple text labels or Lucide icons for now if the actual SVGs aren't available, but the prompt provided data URIs. 
                                    I will copy the data URIs provided in the prompt if possible, or shorten them if they are too long. 
                                    The prompt had base64 images. I will try to keep them if they are reasonable, but for code brevity here I might just use placeholders or icons. 
                                    Let's use Lucide icons or text for platforms to avoid massive base64 strings in the code file unless strictly necessary. 
                                    The user wants COMPACT responsive design. I will use text/icons for cleanliness. */}
                                <div className="flex items-center gap-2 text-xl font-bold"><Disc size={32} /> Spotify</div>
                                <div className="flex items-center gap-2 text-xl font-bold"><Disc size={32} /> Apple Music</div>
                                <div className="flex items-center gap-2 text-xl font-bold"><Disc size={32} /> YouTube</div>
                            </div>
                        </div>

                        {/* Expertise Section */}
                        <div className="space-y-8">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Core Expertise</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="glass-card group flex flex-col gap-4 rounded-2xl p-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                                        <Disc className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Music Production</h4>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                            Custom beat creation ranging from trap to cinematic R&amp;B.
                                        </p>
                                    </div>
                                </div>
                                <div className="glass-card group flex flex-col gap-4 rounded-2xl p-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                                        <Sliders className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Mixing &amp; Mastering</h4>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                            Precision engineering to ensure your tracks compete on global charts.
                                        </p>
                                    </div>
                                </div>
                                <div className="glass-card group flex flex-col gap-4 rounded-2xl p-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                                        <AudioWaveform className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Sound Design</h4>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                            Unique sonic textures and custom sample pack development.
                                        </p>
                                    </div>
                                </div>
                                <div className="glass-card group flex flex-col gap-4 rounded-2xl p-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                                        <Brush className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Art Direction</h4>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                            Cohesive visual identity for singles, albums, and brand rollouts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Profile Image) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        <div className="relative group">
                            <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-b from-primary/20 to-transparent opacity-50 blur-2xl transition duration-1000 group-hover:opacity-75"></div>
                            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0c0910] p-2 shadow-2xl">
                                <div className="aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-slate-900 relative">
                                    {/* Placeholder if image is missing, or trying to load from public */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-700">
                                        <span className="text-xs uppercase tracking-widest font-bold">Profile Image</span>
                                    </div>
                                    <Image
                                        alt="Gold Doz"
                                        src={profile}
                                        width={500}
                                        height={625}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105 relative z-10"
                                        onError={(e) => {
                                            // Fallback logic handled by parent div visibility if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <div className="p-8 text-center">
                                    <h4 className="text-4xl font-black tracking-tight text-white italic">Gold &quot;Doz&quot;</h4>
                                    <p className="mt-3 text-xs font-black uppercase tracking-[0.3em] text-primary">
                                        Founder &amp; Visionary
                                    </p>
                                    <div className="mt-10 flex justify-center gap-4">
                                        <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:bg-primary hover:border-primary group/icon">
                                            <PlayCircle className="text-xl text-white transition-transform group-hover/icon:scale-110" />
                                        </a>
                                        <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:bg-primary hover:border-primary group/icon">
                                            <Mic className="text-xl text-white transition-transform group-hover/icon:scale-110" />
                                        </a>
                                        <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all hover:bg-primary hover:border-primary group/icon">
                                            <Share2 className="text-xl text-white transition-transform group-hover/icon:scale-110" />
                                        </a>
                                    </div>
                                    <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/5 pt-10">
                                        <div className="text-left">
                                            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                Experience
                                            </span>
                                            <span className="text-xl font-bold text-white">10+ Years</span>
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                Projects
                                            </span>
                                            <span className="text-xl font-bold text-white">500+ Beats</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
