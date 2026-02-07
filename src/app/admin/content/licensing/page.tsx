"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Check, AlertCircle, Loader2, Star, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface License {
    id: number;
    name: string;
    subtitle: string;
    price: number;
    priceType: "fixed" | "starting" | "hidden";
    type: string;
    features: string[]; // Handled as array in frontend
    bulk_deals: string;
    isPopular: boolean;
    isActive: boolean;
    ctaText: string;
    details: string;
    sortOrder: number;
}

export default function AdminLicensingPage() {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    useEffect(() => {
        fetchLicenses();
    }, []);

    const fetchLicenses = async () => {
        try {
            const res = await fetch("/api/admin/licenses");
            if (!res.ok) throw new Error("Failed to fetch licenses");
            const data = await res.json();
            // Ensure features is array (API handles parsing but good to be safe)
            setLicenses(data.sort((a: License, b: License) => a.sortOrder - b.sortOrder));
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Failed to load licensing data." });
        } finally {
            setLoading(false);
        }
    };

    const handleLicenseChange = (index: number, field: keyof License, value: any) => {
        const updated = [...licenses];
        updated[index] = { ...updated[index], [field]: value };
        setLicenses(updated);
    };

    const handleFeatureChange = (licenseIndex: number, featureIndex: number, value: string) => {
        const updated = [...licenses];
        updated[licenseIndex].features[featureIndex] = value;
        setLicenses(updated);
    };

    const addFeature = (licenseIndex: number) => {
        const updated = [...licenses];
        updated[licenseIndex].features.push("New Feature");
        setLicenses(updated);
    };

    const removeFeature = (licenseIndex: number, featureIndex: number) => {
        const updated = [...licenses];
        updated[licenseIndex].features.splice(featureIndex, 1);
        setLicenses(updated);
    };

    const saveChanges = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/admin/licenses", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ licenses }),
            });

            if (!res.ok) throw new Error("Failed to save changes");

            setMessage({ type: "success", text: "Licensing info updated successfully!" });

            // Re-fetch to confirm state matches DB (optional but good practice)
            // await fetchLicenses(); 
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Failed to save changes." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-96 items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-[1200px] mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Licensing & Pricing</h1>
                    <p className="text-[#A3A3A3] text-sm font-bold uppercase tracking-widest">Manage your license tiers</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={saveChanges}
                        disabled={saving}
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
                    {message.type === "success" ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <span className="font-bold">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {licenses.map((license, lIdx) => (
                    <div key={license.id} className={`rounded-2xl border p-6 space-y-6 relative transition-all ${license.isActive ? 'bg-[#121212] border-[#262626]' : 'bg-[#0a0a0a] border-white/5 opacity-75'}`}>
                        {/* Header Inputs */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-white/30">License Type: {license.type}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleLicenseChange(lIdx, 'isPopular', !license.isPopular)}
                                        className={`p-2 rounded-lg transition-colors ${license.isPopular ? "bg-[#EC1313] text-white" : "text-white/20 hover:text-white"}`}
                                        title="Toggle Popular Badge"
                                    >
                                        <Star className="h-4 w-4" fill={license.isPopular ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={() => handleLicenseChange(lIdx, 'isActive', !license.isActive)}
                                        className={`p-2 rounded-lg transition-colors ${license.isActive ? "text-green-500" : "text-white/20 hover:text-white"}`}
                                        title={license.isActive ? "License Active" : "License Inactive"}
                                    >
                                        {license.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-white/50">License Name</label>
                                <input
                                    type="text"
                                    value={license.name || ''}
                                    onChange={(e) => handleLicenseChange(lIdx, 'name', e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-white/20"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-white/50">Subtitle</label>
                                <input
                                    type="text"
                                    value={license.subtitle || ''}
                                    onChange={(e) => handleLicenseChange(lIdx, 'subtitle', e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-white/20"
                                />
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5" />

                        {/* Pricing */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-white/50">Price</label>
                                <input
                                    type="number"
                                    value={license.price || 0}
                                    onChange={(e) => handleLicenseChange(lIdx, 'price', parseFloat(e.target.value))}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-white/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-white/50">Details Display</label>
                                <select
                                    value={license.priceType || 'fixed'}
                                    onChange={(e) => handleLicenseChange(lIdx, 'priceType', e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-white/20"
                                >
                                    <option value="fixed">Show Price</option>
                                    <option value="starting">Show "From"</option>
                                    <option value="hidden">Hide Price</option>
                                </select>
                            </div>
                        </div>

                        {/* Features Editor */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-white/50">Features</label>
                            <div className="space-y-2">
                                {(license.features || []).map((feature, fIdx) => (
                                    <div key={fIdx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature || ''}
                                            onChange={(e) => handleFeatureChange(lIdx, fIdx, e.target.value)}
                                            className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-white/20"
                                        />
                                        <button
                                            onClick={() => removeFeature(lIdx, fIdx)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addFeature(lIdx)}
                                    className="w-full py-2 border border-dashed border-white/10 rounded-lg text-[10px] font-bold uppercase text-white/40 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-3 w-3" /> Add Feature
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-white/50">Bulk Deal Text</label>
                            <input
                                type="text"
                                value={license.bulk_deals || ''}
                                onChange={(e) => handleLicenseChange(lIdx, 'bulk_deals', e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-white/20"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-white/50">License Details</label>
                            <textarea
                                value={license.details || ''}
                                onChange={(e) => handleLicenseChange(lIdx, 'details', e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-white/20 min-h-[100px]"
                                placeholder="Enter full license details here..."
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
