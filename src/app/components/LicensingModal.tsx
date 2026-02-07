"use client"
import { Play, Mic, Users, Radio, Video, ChevronDown, ChevronUp, Gavel, ShoppingBag, Check, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useCartStore } from '@/stores/cart.store'

interface Track {
    id: number
    title: string
    artist: string
    cover: string
    price: number // Base price or standard price
    licenses?: any[]
}

interface LicensingModalProps {
    isOpen: boolean
    onClose: () => void
    track: Track | null
}

export default function LicensingModal({ isOpen, onClose, track }: LicensingModalProps) {
    const { addItem } = useCartStore()
    // State to track which license features are expanded
    const [expandedLicenseId, setExpandedLicenseId] = useState<number | null>(null);

    if (!isOpen || !track) return null

    const handleAddToCart = (licenseId: number, name: string, price: number) => {
        addItem({
            trackId: track.id,
            licenseId: licenseId,
            price: price,
            title: track.title,
            artist: track.artist,
            cover: track.cover,
            licenseName: name
        })
        onClose()
    }

    const toggleFeatures = (id: number) => {
        setExpandedLicenseId(expandedLicenseId === id ? null : id);
    }

    // Sort licenses: Standard < Premium < Unlimited < Exclusive (handled separately)
    const sortedLicenses = track.licenses?.sort((a: any, b: any) => a.price - b.price) || [];
    const saleLicenses = sortedLicenses.filter((l: any) => l.licenseType !== 'Exclusive');
    const exclusiveLicense = sortedLicenses.find((l: any) => l.licenseType === 'Exclusive');

    // Construct mailto link for negotiation
    const mailtoSubject = encodeURIComponent(`Negotiating for ${track.title} by ${track.artist}`);
    const mailtoBody = encodeURIComponent(`Hi,\n\nI am interested in an Exclusive license for "${track.title}".\n\nMy offer is: `);
    const negotiationLink = `mailto:contact@dozdripz.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm transition-all z-100" id="licensing-modal">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-[900px] max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#050505] shadow-2xl flex flex-col md:flex-row z-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 text-white/50 hover:text-white transition-colors p-2 bg-black/50 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Left Sidebar (Artwork & Info) */}
                <div className="w-full md:w-[320px] p-6 flex flex-row md:flex-col items-center gap-4 md:gap-0 md:justify-center border-b md:border-b-0 md:border-r border-white/5 bg-[#0a0a0a]">
                    <div className="relative group aspect-square w-20 md:w-full md:max-w-[240px] rounded-lg md:rounded-xl overflow-hidden shadow-2xl md:mb-6 flex-shrink-0 bg-zinc-800">
                        {track.cover ? (
                            <Image
                                alt={track.title}
                                src={track.cover}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-white/20">
                                <span className="text-4xl">?</span>
                            </div>
                        )}

                        <div className="hidden md:flex absolute inset-0 bg-black/40 items-center justify-center group-hover:bg-black/20 transition-all cursor-pointer">
                            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-doz-red text-white shadow-xl">
                                <Play className="fill-current ml-1" size={28} />
                            </div>
                        </div>
                    </div>
                    <div className="text-left md:text-center min-w-0">
                        <h3 className="text-lg md:text-2xl font-black tracking-tight text-white uppercase truncate">{track.title}</h3>
                        <p className="text-doz-red text-xs md:text-sm font-black uppercase tracking-widest mt-1 md:mt-2 truncate">{track.artist}</p>
                    </div>
                </div>

                {/* Right Content (Licenses) */}
                <div className="flex-1 p-4 md:p-8 flex flex-col gap-3 md:gap-4 overflow-y-auto bg-[#050505]">

                    {saleLicenses.map((license: any) => {
                        const isPremium = license.licenseType === 'Premium' || license.licenseType === 'Unlimited';
                        const features = license.contractFeatures ? JSON.parse(license.contractFeatures) : [];
                        const isExpanded = expandedLicenseId === license.id;

                        return (
                            <div
                                key={license.id}
                                className={`group relative rounded-xl border transition-all p-4 md:p-5 ${isPremium ? 'border-2 border-doz-red bg-doz-red/5 shadow-[0_0_30px_rgba(227,27,35,0.1)] hover:bg-doz-red/10 mt-4' : 'border-white/10 bg-white/5 hover:border-doz-red/50'}`}
                            >
                                {isPremium && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-doz-red text-[10px] font-black px-3 py-1 rounded-full text-white uppercase tracking-widest shadow-lg">
                                        Best Value
                                    </div>
                                )}

                                <div className={`flex items-center justify-between mb-2 md:mb-4 ${isPremium ? 'pt-2' : ''}`}>
                                    <div>
                                        <h4 className="font-bold text-base md:text-lg text-white">{license.licenseType}</h4>
                                        <p className={`${isPremium ? 'text-doz-red/80' : 'text-white/40'} text-[10px] uppercase font-bold tracking-widest`}>
                                            {license.licenseType === 'Standard' ? 'MP3 & WAV' : 'STEMS, MP3 & WAV'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(license.id, license.licenseType, license.price)}
                                        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-black text-xs transition-all hover:scale-105 uppercase ${isPremium ? 'bg-doz-red text-white ring-2 ring-white/20' : 'bg-doz-red text-white'}`}
                                    >
                                        <ShoppingBag size={14} /> ₹{license.price}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {features.map((feature: string, idx: number) => (
                                            <div key={idx} className={`flex items-center gap-2 text-[11px] font-medium ${isPremium ? 'text-white' : 'text-white/70'}`}>
                                                <Check size={14} className={isPremium ? "text-doz-red" : "text-white/40"} /> {feature}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => toggleFeatures(license.id)}
                                    className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter transition-colors ${isPremium ? 'text-doz-red/60 hover:text-doz-red' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    {isExpanded ? (
                                        <><ChevronUp size={12} /> Hide features</>
                                    ) : (
                                        <><ChevronDown size={12} /> Show features</>
                                    )}
                                </button>
                            </div>
                        );
                    })}

                    {/* EXCLUSIVE (Always show if present, or statically if we want to encourage negotiation) */}
                    <div className="group relative rounded-xl border border-white/10 bg-white/5 p-4 md:p-5 hover:border-doz-red/50 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-base md:text-lg text-white">Exclusive</h4>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">NEGOTIATE</p>
                            </div>
                            <a
                                href={negotiationLink}
                                className="flex items-center gap-2 bg-white text-black px-3 md:px-4 py-2 rounded-lg font-black text-xs transition-all hover:bg-doz-red hover:text-white uppercase"
                            >
                                Make an Offer
                            </a>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex flex-col items-center gap-3">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center">Unsure about pricing?</p>
                        <a
                            href={negotiationLink}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 text-white font-bold text-sm hover:bg-doz-red transition-all group"
                        >
                            <Gavel size={18} className="group-hover:scale-110 transition-transform" /> Negotiate the price
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
