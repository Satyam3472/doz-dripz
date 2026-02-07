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

    const getAudioDuration = (file: File): Promise<number> => {
        return new Promise((resolve) => {
            const objectUrl = URL.createObjectURL(file);
            const audio = document.createElement("audio");
            audio.src = objectUrl;
            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(Math.round(audio.duration));
            };
            audio.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(0);
            };
        });
    };

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        genre: "Trap",
        bpm: "",
        key: "",
        tags: "",
    });

    const [files, setFiles] = useState<{ cover: File | null; audio: File | null }>({ cover: null, audio: null });
    const [audioMode, setAudioMode] = useState<'upload' | 'url'>('upload');
    const [audioUrl, setAudioUrl] = useState('');
    const [coverMode, setCoverMode] = useState<'upload' | 'url'>('upload');
    const [coverUrl, setCoverUrl] = useState('');

    // Edit Terms State
    const [editingLicenseIndex, setEditingLicenseIndex] = useState<number | null>(null);
    const [editFeatures, setEditFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState("");

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

    const handleOpenEditTerms = (index: number) => {
        setEditingLicenseIndex(index);
        setEditFeatures([...licenses[index].features]);
        setNewFeature("");
    };

    const handleAddFeature = () => {
        if (!newFeature.trim()) return;
        setEditFeatures([...editFeatures, newFeature.trim()]);
        setNewFeature("");
    };

    const handleRemoveFeature = (idx: number) => {
        const updated = [...editFeatures];
        updated.splice(idx, 1);
        setEditFeatures(updated);
    };

    const handleSaveTerms = () => {
        if (editingLicenseIndex === null) return;
        const newLicenses = [...licenses];
        newLicenses[editingLicenseIndex].features = editFeatures;
        setLicenses(newLicenses);
        setEditingLicenseIndex(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!files.audio && !audioUrl) || !formData.title) {
            alert("Please provide at least a Title and Audio Source.");
            return;
        }

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("artist", "DOZ DRIPZ"); // Default
            data.append("bpm", formData.bpm);
            data.append("key", formData.key);
            data.append("tags", JSON.stringify(formData.tags.split(",").map(t => t.trim())));
            data.append("genre", formData.genre);

            if (files.cover && coverMode === 'upload') {
                data.append("cover", files.cover);
            } else if (coverMode === 'url' && coverUrl) {
                data.append("coverUrl", coverUrl);
            }

            if (audioMode === 'upload' && files.audio) {
                data.append("audio", files.audio);
            } else if (audioMode === 'url' && audioUrl) {
                data.append("audioUrl", audioUrl);
            }

            // Calculate duration
            let duration = 0;
            if (files.audio && audioMode === 'upload') {
                duration = await getAudioDuration(files.audio);
            } else if (audioUrl && audioMode === 'url') {
                // Try to get duration from URL if possible, otherwise 0
                // Note: This relies on browser support and CORS
                try {
                    const audio = new Audio(audioUrl);
                    await new Promise((resolve, reject) => {
                        audio.onloadedmetadata = () => resolve(true);
                        audio.onerror = () => resolve(false); // resolve false to skip
                        // Timeout to prevent hanging
                        setTimeout(() => resolve(false), 5000);
                    });
                    if (audio.duration && isFinite(audio.duration)) {
                        duration = Math.round(audio.duration);
                    }
                } catch (e) {
                    console.warn("Could not fetch audio duration from URL", e);
                }
            }

            data.append("duration", duration.toString());

            // Get Standard License Price
            const standardLicense = licenses.find(l => l.name === "Standard");
            const price = standardLicense ? standardLicense.price : 0;
            data.append("price", price.toString());

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
                const errorData = await res.json();
                alert(`Failed to upload track: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error uploading track. See console for details.");
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
                            <div className="grid grid-cols-4 gap-4">
                                <div className="flex flex-col gap-2 col-span-3">
                                    <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Track Title</label>
                                    <input
                                        className="bg-[#121212] border border-[#262626] rounded-lg px-4 py-3 text-white text-sm font-medium focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all outline-none w-full"
                                        placeholder="e.g. Midnight Horizon"
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
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
                            </div>
                            <div className="grid grid-cols-4 gap-4">
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
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Key</label>
                                    <input
                                        className="bg-[#121212] border border-[#262626] rounded-lg px-4 py-3 text-white text-sm font-medium focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all outline-none w-full"
                                        placeholder="C Minor"
                                        type="text"
                                        value={formData.key}
                                        onChange={e => setFormData({ ...formData, key: e.target.value })}
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
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-extrabold text-[#A3A3A3] uppercase tracking-widest">Cover Art (Optional)</label>
                                    <div className="flex bg-[#121212] border border-[#262626] rounded-lg p-1">
                                        <button
                                            type="button"
                                            onClick={() => setCoverMode('upload')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${coverMode === 'upload' ? 'bg-[#262626] text-white shadow-sm' : 'text-[#A3A3A3] hover:text-white'}`}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCoverMode('url')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${coverMode === 'url' ? 'bg-[#262626] text-white shadow-sm' : 'text-[#A3A3A3] hover:text-white'}`}
                                        >
                                            URL
                                        </button>
                                    </div>
                                </div>

                                {coverMode === 'upload' ? (
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className="h-20 w-20 bg-white/[0.02] border border-[#262626] rounded-lg flex items-center justify-center overflow-hidden group-hover:border-white/20 transition-colors">
                                            {files.cover ? (
                                                <img src={URL.createObjectURL(files.cover)} alt="Cover" className="h-full w-full object-cover" />
                                            ) : (
                                                <Upload className="text-[#A3A3A3]" size={24} />
                                            )}
                                        </div>
                                        <div className="text-xs text-[#A3A3A3]">
                                            <span className="text-white font-bold underline">Click to upload</span> cover art.<br /> Recommended 3000x3000px.
                                        </div>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="hidden" />
                                    </label>
                                ) : (
                                    <div className="space-y-3">
                                        <input
                                            className="bg-[#121212] border border-[#262626] rounded-lg px-4 py-3 text-white text-sm font-medium focus:ring-1 focus:ring-white/20 focus:border-white/30 transition-all outline-none w-full"
                                            placeholder="https://example.com/image.jpg"
                                            type="url"
                                            value={coverUrl}
                                            onChange={(e) => setCoverUrl(e.target.value)}
                                        />
                                        {coverUrl && (
                                            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5">
                                                <div className="h-10 w-10 relative overflow-hidden rounded bg-black">
                                                    <img src={coverUrl} alt="Preview" className="object-cover w-full h-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                </div>
                                                <span className="text-[10px] text-white/50 uppercase font-bold">Preview</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="flex flex-col gap-6">
                            {/* Audio File */}
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
                                            {files.audio ? <Check className="text-green-500" size={30} /> : <CloudUpload className="text-[#A3A3A3]" size={30} />}
                                        </div>
                                        <p className="text-sm font-bold text-white mb-1">{files.audio ? files.audio.name : "Drag and drop audio files"}</p>
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
                                        <p className="text-[11px] text-[#A3A3A3]">Provide a direct link to the audio file (Google Drive, Dropbox, etc).</p>
                                    </div>
                                )}
                            </div>

                            {/* Cover Art (Added to match backend requirement, though not explicit in user's general HTML logic block, it's safer to have) */}

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

                                <button
                                    type="button"
                                    onClick={() => handleOpenEditTerms(idx)}
                                    disabled={!license.enabled}
                                    className="mt-8 w-full py-2.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Edit Terms
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </form>

            {/* Edit Terms Modal */}
            {editingLicenseIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Edit {licenses[editingLicenseIndex].name} Terms</h3>
                            <button onClick={() => setEditingLicenseIndex(null)} className="text-white/50 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
                            {editFeatures.map((feature, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 group">
                                    <div className="flex items-center gap-3">
                                        <Check size={14} className="text-[#A3A3A3]" />
                                        <span className="text-sm text-white/90">{feature}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFeature(idx)}
                                        type="button"
                                        className="text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            {editFeatures.length === 0 && (
                                <p className="text-center text-white/30 text-xs py-4">No features added yet.</p>
                            )}
                        </div>

                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                placeholder="Add new feature..."
                                className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-white/30 outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg font-bold text-xl"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditingLicenseIndex(null)}
                                className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveTerms}
                                className="bg-[#EC1313] hover:bg-[#EC1313]/90 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
