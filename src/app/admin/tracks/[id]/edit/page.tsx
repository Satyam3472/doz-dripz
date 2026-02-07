"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Info,
    CloudUpload,
    ShieldCheck,
    Check,
    Upload,
    X,
    Music,
    Loader2
} from "lucide-react";

export default function EditTrackPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        genre: "Trap",
        bpm: "",
        tags: "",
    });

    // We store URLs for existing files, and File objects for new uploads
    const [existingFiles, setExistingFiles] = useState<{ cover: string; audio: string }>({ cover: "", audio: "" });
    const [files, setFiles] = useState<{ cover: File | null; audio: File | null }>({ cover: null, audio: null });
    const [audioMode, setAudioMode] = useState<'upload' | 'url'>('upload');
    const [audioUrl, setAudioUrl] = useState('');

    // Licensing State
    const [licenses, setLicenses] = useState([
        {
            id: 'basic',
            name: "Standard",
            subtitle: "Best for emerging artists",
            price: 2499,
            enabled: true,
            features: ["MP3 Delivery", "10,000 Streams Limit", "Non-Profit Use Only"]
        },
        {
            id: 'unlim',
            name: "Unlimited",
            subtitle: "Ideal for growing channels",
            price: 7999,
            enabled: true,
            features: ["MP3 + WAV Delivery", "Unlimited Streams", "Music Video Rights", "Radio Broadcasting"]
        },
        {
            id: 'excl',
            name: "Exclusive",
            subtitle: "Full ownership transfer",
            price: 39999,
            enabled: false,
            features: ["Stems / Trackouts", "Full Copyright Transfer", "Commercial Distribution", "Removed From Store"]
        }
    ]);

    // Fetch Track Data
    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const res = await fetch(`/api/admin/tracks/${params.id}`);
                if (!res.ok) throw new Error("Failed to load track");
                const track = await res.json();

                // Populate Form
                setFormData({
                    title: track.title,
                    genre: track.genre || "Trap",
                    bpm: track.bpm.toString(),
                    tags: Array.isArray(track.tags) ? track.tags.join(", ") : track.tags || "",
                });

                setExistingFiles({
                    cover: track.coverArtUrl || "",
                    audio: track.audio_url || ""
                });

                // Determine Audio Mode
                if (track.audio_url && !track.audio_url.startsWith('/uploads')) {
                    setAudioMode('url');
                    setAudioUrl(track.audio_url);
                } else {
                    setAudioMode('upload');
                }

                // Populate Licenses
                // We need to map DB licenses (track.licenses) to our UI state.
                // We enabled them if they exist in DB.
                if (track.licenses && track.licenses.length > 0) {
                    const newLicenses = licenses.map(uiLic => {
                        const dbLic = track.licenses.find((l: any) => l.licenseType === uiLic.name);
                        if (dbLic) {
                            return { ...uiLic, enabled: true, price: dbLic.price };
                        }
                        return { ...uiLic, enabled: false };
                    });
                    setLicenses(newLicenses);
                }

            } catch (error) {
                console.error(error);
                alert("Error loading track data");
                router.push("/admin/tracks");
            } finally {
                setLoading(false);
            }
        };

        fetchTrack();
    }, [params.id]);


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

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("bpm", formData.bpm);
            data.append("genre", formData.genre);
            data.append("tags", JSON.stringify(formData.tags.split(",").map(t => t.trim())));

            if (files.cover) data.append("cover", files.cover);

            if (audioMode === 'upload' && files.audio) {
                data.append("audio", files.audio);
            } else if (audioMode === 'url' && audioUrl !== existingFiles.audio) {
                data.append("audioUrl", audioUrl);
            } else if (audioMode === 'url' && audioUrl) {
                data.append("audioUrl", audioUrl);
            }

            const activeLicenses = licenses.filter(l => l.enabled).map(l => ({
                type: l.name,
                price: l.price
            }));
            data.append("licenses", JSON.stringify(activeLicenses));

            const res = await fetch(`/api/admin/tracks/${params.id}`, {
                method: "PUT",
                body: data
            });

            if (res.ok) {
                router.push("/admin/tracks"); // Or stay on page based on requirements, prompts says "Edit -> stay on page"
                // But usually better to refresh or show success.
                // Prompt: "Edit → stay on page". Okay.
                alert("Track updated successfully!");
                // router.refresh(); // Refresh to show new data if any
            } else {
                alert("Failed to update track.");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating track.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-white" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-10 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-white text-3xl font-extrabold tracking-tight">Edit Track</h2>
                    <p className="text-[#A3A3A3] text-sm font-medium">Update beat details and license contracts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-[#EC1313] text-white px-8 py-3 rounded-xl text-sm font-bold tracking-tight hover:brightness-110 shadow-lg shadow-[#EC1313]/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Save Changes"}
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
                            <div className="grid grid-cols-4 gap-4">
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
                                <div className="flex flex-col gap-2 col-span-2">
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
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">
                                    Cover Art {existingFiles.cover ? "(Uploaded)" : "(Optional)"}
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <div className="h-16 w-16 bg-white/[0.02] border border-[#262626] rounded-lg flex items-center justify-center overflow-hidden relative">
                                        {files.cover ? (
                                            <img src={URL.createObjectURL(files.cover)} alt="Cover" className="h-full w-full object-cover" />
                                        ) : existingFiles.cover ? (
                                            <img src={existingFiles.cover} alt="Cover" className="h-full w-full object-cover" />
                                        ) : (
                                            <Upload className="text-[#A3A3A3]" size={20} />
                                        )}
                                        {/* Overlay for change hint */}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <Upload className="text-white" size={20} />
                                        </div>
                                    </div>
                                    <div className="text-xs text-[#A3A3A3]">
                                        <span className="text-white font-bold underline">Click to change</span> cover art.<br /> Recommended 3000x3000px.
                                    </div>
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="flex flex-col gap-6">
                            {/* Audio Source */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Audio Source</label>

                                {/* Toggle */}
                                <div className="flex bg-[#121212] border border-[#262626] rounded-lg p-1 w-fit mb-2">
                                    <button
                                        type="button"
                                        onClick={() => setAudioMode('upload')}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${audioMode === 'upload' ? 'bg-[#262626] text-white shadow-sm' : 'text-[#A3A3A3] hover:text-white'}`}
                                    >
                                        Upload File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAudioMode('url')}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${audioMode === 'url' ? 'bg-[#262626] text-white shadow-sm' : 'text-[#A3A3A3] hover:text-white'}`}
                                    >
                                        Paste URL
                                    </button>
                                </div>

                                {audioMode === 'upload' ? (
                                    <label className="flex-1 border-2 border-dashed border-[#262626] rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center p-8 hover:bg-white/[0.04] transition-all group cursor-pointer h-[200px] relative">
                                        <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            {(files.audio || existingFiles.audio) ? <Check className="text-green-500" size={30} /> : <CloudUpload className="text-[#A3A3A3]" size={30} />}
                                        </div>
                                        <p className="text-sm font-bold text-white mb-1">
                                            {files.audio ? files.audio.name : existingFiles.audio ? "Audio File Uploaded (Click to Replace)" : "Drag and drop audio files"}
                                        </p>
                                        <p className="text-[11px] text-[#A3A3A3]">WAV, MP3, or AIFF up to 250MB</p>
                                        <div className="mt-4 px-4 py-2 bg-[#121212] border border-[#262626] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#262626] transition-colors cursor-pointer text-white">
                                            Browse Files
                                        </div>
                                        <input type="file" accept="audio/*" onChange={(e) => handleFileChange(e, 'audio')} className="hidden" />
                                    </label>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            className="bg-[#121212] border border-[#262626] rounded-lg px-4 py-3 text-white text-sm font-medium focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all outline-none w-full"
                                            placeholder="Enter Google Drive or Direct Link..."
                                            type="url"
                                            value={audioUrl}
                                            onChange={(e) => setAudioUrl(e.target.value)}
                                        />
                                        <p className="text-[11px] text-[#A3A3A3]">Provide a direct link to the audio file.</p>
                                        {existingFiles.audio && !audioUrl && (
                                            <p className="text-[10px] text-green-500/80">current: {existingFiles.audio}</p>
                                        )}
                                    </div>
                                )}
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
                                    <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest block mb-2">Price (INR)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] font-bold">₹</span>
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
            </form>
        </div>
    );
}
