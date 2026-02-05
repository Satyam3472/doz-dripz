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
}

interface LicensingModalProps {
    isOpen: boolean
    onClose: () => void
    track: Track | null
}

export default function LicensingModal({ isOpen, onClose, track }: LicensingModalProps) {
    const { addItem } = useCartStore()
    const [showStandardFeatures, setShowStandardFeatures] = useState(false)
    const [showPremiumFeatures, setShowPremiumFeatures] = useState(false)

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

    // Construct mailto link for negotiation
    const mailtoSubject = encodeURIComponent(`Negotiating for ${track.title} by ${track.artist}`);
    const mailtoBody = encodeURIComponent(`Hi,\n\nI am interested in an Exclusive license for "${track.title}".\n\nMy offer is: `);
    const negotiationLink = `mailto:contact@dozdripz.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm transition-all" id="licensing-modal">
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
                    <div className="relative group aspect-square w-20 md:w-full md:max-w-[240px] rounded-lg md:rounded-xl overflow-hidden shadow-2xl md:mb-6 flex-shrink-0">
                        <Image
                            alt={track.title}
                            src={track.cover}
                            fill
                            className="object-cover"
                        />
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

                    {/* STANDARD */}
                    <div className="group relative rounded-xl border border-white/10 bg-white/5 p-4 md:p-5 hover:border-doz-red/50 transition-all">
                        <div className="flex items-center justify-between mb-2 md:mb-4">
                            <div>
                                <h4 className="font-bold text-base md:text-lg text-white">Standard</h4>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">MP3 & WAV</p>
                            </div>
                            <button
                                onClick={() => handleAddToCart(1, "Standard Lease", 29.99)}
                                className="flex items-center gap-2 bg-doz-red text-white px-3 md:px-4 py-2 rounded-lg font-black text-xs transition-all hover:scale-105 uppercase"
                            >
                                <ShoppingBag size={14} /> ₹29.99
                            </button>
                        </div>

                        {showStandardFeatures && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 opacity-70 mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2 text-[11px] font-medium text-white/70">
                                    <Mic size={14} className="text-white/40" /> Used for Music Recording
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-medium text-white/70">
                                    <Users size={14} className="text-white/40" /> Distribute up to 2,000 copies
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-medium text-white/70">
                                    <Radio size={14} className="text-white/40" /> 500,000 Online Audio Streams
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-medium text-white/70">
                                    <Video size={14} className="text-white/40" /> 1 Music Video
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowStandardFeatures(!showStandardFeatures)}
                            className="flex items-center gap-1 text-[10px] font-bold text-white/30 uppercase tracking-tighter hover:text-white/60 transition-colors"
                        >
                            {showStandardFeatures ? (
                                <><ChevronUp size={12} /> Hide features</>
                            ) : (
                                <><ChevronDown size={12} /> Show features</>
                            )}
                        </button>
                    </div>

                    {/* PREMIUM */}
                    <div className="group relative rounded-xl border-2 border-doz-red bg-doz-red/5 p-4 md:p-5 shadow-[0_0_30px_rgba(227,27,35,0.1)] hover:bg-doz-red/10 transition-colors">
                        <div className="absolute -top-3 left-4 bg-doz-red text-[10px] font-black px-2 py-0.5 rounded text-white uppercase tracking-widest">Best Value</div>
                        <div className="flex items-center justify-between mb-2 md:mb-4 pt-1">
                            <div>
                                <h4 className="font-bold text-base md:text-lg text-white">Premium</h4>
                                <p className="text-doz-red/80 text-[10px] uppercase font-bold tracking-widest">STEMS, MP3 & WAV</p>
                            </div>
                            <button
                                onClick={() => handleAddToCart(2, "Premium Lease", 99.99)}
                                className="flex items-center gap-2 bg-doz-red text-white px-3 md:px-4 py-2 rounded-lg font-black text-xs transition-all hover:scale-105 uppercase ring-2 ring-white/20"
                            >
                                <ShoppingBag size={14} /> ₹99.99
                            </button>
                        </div>

                        {showPremiumFeatures && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2 text-[11px] font-medium text-white">
                                    <Check size={14} className="text-doz-red" /> Unlimited Recording
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-medium text-white">
                                    <Check size={14} className="text-doz-red" /> Unlimited Distribution
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-medium text-white">
                                    <Check size={14} className="text-doz-red" /> Unlimited Streams
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-medium text-white">
                                    <Check size={14} className="text-doz-red" /> Radio Broadcasting
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowPremiumFeatures(!showPremiumFeatures)}
                            className="flex items-center gap-1 text-[10px] font-bold text-doz-red/60 uppercase tracking-tighter hover:text-doz-red transition-colors"
                        >
                            {showPremiumFeatures ? (
                                <><ChevronUp size={12} /> Hide features</>
                            ) : (
                                <><ChevronDown size={12} /> Show features</>
                            )}
                        </button>
                    </div>

                    {/* EXCLUSIVE */}
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
