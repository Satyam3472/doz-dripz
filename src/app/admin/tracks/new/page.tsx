"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Info,
    CloudUpload,
    ShieldCheck,
    Check,
    Upload,
    X,
    Music
} from "lucide-react";

export default function NewTrackPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        genre: "Trap",
        bpm: "",
        tags: "",
    });

    const [files, setFiles] = useState<{ cover: File | null; audio: File | null }>({ cover: null, audio: null });

    // Licensing State
    const [licenses, setLicenses] = useState([
        {
            id: 'basic',
            name: "Standard",
            subtitle: "Best for emerging artists",
            price: 29.99,
            enabled: true,
            features: ["MP3 Delivery", "10,000 Streams Limit", "Non-Profit Use Only"]
        },
        {
            id: 'unlim',
            name: "Unlimited",
            subtitle: "Ideal for growing channels",
            price: 99.99,
            enabled: true,
            features: ["MP3 + WAV Delivery", "Unlimited Streams", "Music Video Rights", "Radio Broadcasting"]
        },
        {
            id: 'excl',
            name: "Exclusive",
            subtitle: "Full ownership transfer",
            price: 499.99,
            enabled: false,
            features: ["Stems / Trackouts", "Full Copyright Transfer", "Commercial Distribution", "Removed From Store"]
        }
    ]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'audio') => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    const handleLicensePriceChange = (index: number, newPrice: string) => {
        const newLicenses = [...licenses];
        newLicenses[index].price = parseFloat(newPrice) || 0;
        setLicenses(newLicenses);
    };

    const toggleLicense = (index: number) => {
        const newLicenses = [...licenses];
        newLicenses[index].enabled = !newLicenses[index].enabled;
        setLicenses(newLicenses);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.audio || !formData.title) {
            alert("Please provide at least a Title and Audio File.");
            return;
        }

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("artist", "DOZ DRIPZ"); // Default
            data.append("bpm", formData.bpm);
            data.append("key", ""); // Not in design, optional
            data.append("tags", JSON.stringify(formData.tags.split(",").map(t => t.trim())));

            if (files.cover) data.append("cover", files.cover);
            if (files.audio) data.append("audio", files.audio);

            // Map design licenses to backend format
            const activeLicenses = licenses.filter(l => l.enabled).map(l => ({
                type: l.name,
                price: l.price
            }));
            data.append("licenses", JSON.stringify(activeLicenses));

            const res = await fetch("/api/admin/tracks", {
                method: "POST",
                body: data
            });

            if (res.ok) {
                router.push("/admin/tracks");
            } else {
                alert("Failed to upload track.");
            }
        } catch (error) {
            console.error(error);
            alert("Error uploading track.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-10 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-white text-3xl font-extrabold tracking-tight">Upload New Track</h2>
                    <p className="text-[#A3A3A3] text-sm font-medium">Configure your beat details and license contracts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-semibold text-[#A3A3A3] hover:text-white transition-colors">Discard Draft</button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-[#EC1313] text-white px-8 py-3 rounded-xl text-sm font-bold tracking-tight hover:brightness-110 shadow-lg shadow-[#EC1313]/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {submitting ? "Publishing..." : "Publish Track"}
                    </button>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* General Info */}
                <section className="bg-[#121212]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <Info className="text-[#A3A3A3]" size={20} />
                        <h3 className="text-lg font-bold text-white">General Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Inputs */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Track Title</label>
                                <input
                                    className="bg-[#121212] border border-[#262626] rounded-lg px-4 py-3 text-white text-sm font-medium focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all outline-none w-full"
                                    placeholder="e.g. Midnight Horizon"
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Genre</label>
                                    <select
                                        className="bg-[#121212] border border-[#262626] rounded-lg px-4 py-3 text-white text-sm font-medium focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all outline-none w-full appearance-none"
                                        value={formData.genre}
                                        onChange={e => setFormData({ ...formData, genre: e.target.value })}
                                    >
                                        <option>Trap</option>
                                        <option>Drill</option>
                                        <option>Lofi</option>
                                        <option>Boom Bap</option>
                                        <option>R&B</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">BPM</label>
                                    <input
                                        className="bg-[#121212] border border-[#262626] rounded-lg px-4 py-3 text-white text-sm font-medium focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all outline-none w-full"
                                        placeholder="140"
                                        type="number"
                                        value={formData.bpm}
                                        onChange={e => setFormData({ ...formData, bpm: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Tags (Max 3)</label>
                                <input
                                    className="bg-[#121212] border border-[#262626] rounded-lg px-4 py-3 text-white text-sm font-medium focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all outline-none w-full"
                                    placeholder="dark, energetic, hard"
                                    type="text"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="flex flex-col gap-6">
                            {/* Audio File */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Audio Files</label>
                                <label className="flex-1 border-2 border-dashed border-[#262626] rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center p-8 hover:bg-white/[0.04] transition-all group cursor-pointer h-[200px] relative">
                                    <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        {files.audio ? <Check className="text-green-500" size={30} /> : <CloudUpload className="text-[#A3A3A3]" size={30} />}
                                    </div>
                                    <p className="text-sm font-bold text-white mb-1">{files.audio ? files.audio.name : "Drag and drop audio files"}</p>
                                    <p className="text-[11px] text-[#A3A3A3]">WAV, MP3, or AIFF up to 250MB</p>
                                    <button className="mt-4 px-4 py-2 bg-[#121212] border border-[#262626] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#262626] transition-colors" type="button">
                                        Browse Files
                                    </button>
                                    <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 'audio')} className="hidden" />
                                </label>
                            </div>

                            {/* Cover Art (Added to match backend requirement, though not explicit in user's general HTML logic block, it's safer to have) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Cover Art (Optional)</label>
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <div className="h-16 w-16 bg-white/[0.02] border border-[#262626] rounded-lg flex items-center justify-center overflow-hidden">
                                        {files.cover ? (
                                            <img src={URL.createObjectURL(files.cover)} alt="Cover" className="h-full w-full object-cover" />
                                        ) : (
                                            <Image as={Upload} src="" alt="" className="text-[#A3A3A3]" />
                                        )}
                                        {!files.cover && <Upload className="text-[#A3A3A3]" size={20} />}
                                    </div>
                                    <div className="text-xs text-[#A3A3A3]">
                                        <span className="text-white font-bold underline">Click to upload</span> cover art.<br /> Recommended 3000x3000px.
                                    </div>
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Licensing */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="text-[#A3A3A3]" size={20} />
                            <h3 className="text-lg font-bold text-white">Licensing & Pricing</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {licenses.map((license, idx) => (
                            <div key={license.id} className={`bg-[#121212]/40 backdrop-blur-xl rounded-2xl p-6 border flex flex-col ${license.enabled ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-white font-bold text-base">{license.name}</h4>
                                        <p className="text-[#A3A3A3] text-[11px]">{license.subtitle}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={license.enabled}
                                        onChange={() => toggleLicense(idx)}
                                        className="h-5 w-5 rounded-sm border-white/20 bg-transparent checked:bg-[#EC1313] checked:border-[#EC1313] focus:ring-0 focus:ring-offset-0"
                                    />
                                </div>

                                <div className="mb-8">
                                    <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest block mb-2">Price (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] font-bold">$</span>
                                        <input
                                            className="bg-[#121212] border border-[#262626] rounded-lg pl-8 pr-4 py-3 text-white text-sm font-medium focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all outline-none w-full"
                                            type="number"
                                            value={license.price}
                                            onChange={(e) => handleLicensePriceChange(idx, e.target.value)}
                                            disabled={!license.enabled}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest block mb-1">Contract Features</label>
                                    {license.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-3">
                                            <div className={`h-4 w-4 rounded-full flex items-center justify-center ${license.enabled ? 'bg-white/10' : 'bg-white/5'}`}>
                                                <Check size={10} className="text-white" />
                                            </div>
                                            <span className="text-xs text-white/80 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button type="button" className="mt-8 w-full py-2.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white">Edit Terms</button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Actions */}
                <div className="pt-10 border-t border-[#262626] flex items-center justify-end gap-6">
                    <div className="flex items-center gap-3">
                        <span className="size-2 rounded-full bg-green-500"></span>
                        <span className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Auto-saved 2 mins ago</span>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#EC1313] text-white px-12 py-4 rounded-xl text-sm font-bold tracking-tight hover:brightness-110 shadow-lg shadow-[#EC1313]/20 transition-all active:scale-[0.98] uppercase tracking-widest disabled:opacity-50"
                    >
                        {submitting ? "Publishing..." : "Publish Track"}
                    </button>
                </div>
            </form>
        </div>
    );
}
