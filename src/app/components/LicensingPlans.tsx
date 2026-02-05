"use client"
import { Star, Check, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function LicensingPlans() {
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const scrollCenter = container.scrollLeft + (container.clientWidth / 2)

            // Find which child is closest to the center
            const children = Array.from(container.children) as HTMLElement[]
            let closestIndex = 0
            let minDistance = Number.MAX_VALUE

            children.forEach((child, index) => {
                const childCenter = child.offsetLeft + (child.offsetWidth / 2)
                const distance = Math.abs(scrollCenter - childCenter)
                if (distance < minDistance) {
                    minDistance = distance
                    closestIndex = index
                }
            })

            setActiveIndex(closestIndex)
        }
    }

    // Scroll to the middle item (Popular) on mount for mobile
    useEffect(() => {
        const container = scrollContainerRef.current
        if (container && window.innerWidth < 768) { // md breakpoint
            // Assuming 3 items, index 1 is the middle
            const children = Array.from(container.children) as HTMLElement[]
            if (children[1]) {
                const child = children[1]
                // Calculate position to center the child
                // scrollLeft = child.offsetLeft - (containerWidth/2) + (childWidth/2)
                const scrollPos = child.offsetLeft - (container.clientWidth / 2) + (child.offsetWidth / 2)
                container.scrollTo({ left: scrollPos, behavior: 'smooth' })
            }
        }
    }, [])

    return (
        <section className="bg-[#050505] py-20 text-white ">
            <div className="mx-auto max-w-[1000px] px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Licensing Info
                    </h2>
                </div>

                {/* Container: Scrollable on mobile, Grid on desktop */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex w-full snap-x snap-mandatory items-center sm:items-stretch gap-4 overflow-x-auto pb-8 text-center hide-scrollbar md:grid md:grid-cols-3 md:items-center md:pb-0 md:overflow-visible md:gap-6"
                >

                    {/* STANDARD PLAN */}
                    <div className="min-w-[80%] snap-center rounded-xl border border-white/10 bg-transparent p-6 sm:min-w-0 transition-transform duration-300 scale-95 md:scale-100">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                            Standard (MP3 + WAV)
                        </h3>
                        <div className="mt-4 text-4xl font-black tracking-tight text-white">
                            ₹29.99
                        </div>

                        <div className="mt-6 space-y-2 text-xs font-medium text-white/60">
                            <p>• No content ID</p>
                            <p>• 1 Music Video</p>
                            <p>• 100k Streams</p>
                        </div>

                        <button className="mt-8 w-full rounded bg-[#222] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#333] transition-colors">
                            Read License
                        </button>

                        <div className="mt-8 space-y-1 text-[10px] font-bold uppercase tracking-widest text-[#FFF]">
                            <p>Bulk deals:</p>
                            <p className="text-doz-red">Buy 2 Tracks, Get 1 Free!</p>
                        </div>
                    </div>

                    {/* UNLIMITED PLAN (Highlighted) */}
                    <div className="relative min-w-[80%] snap-center rounded-xl bg-[#E0E0E0] p-8 text-black shadow-2xl sm:min-w-0 scale-100 md:scale-110">
                        <div className="mb-4 flex justify-center">
                            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black/60">
                                <Star className="h-3 w-3 fill-black text-black" /> Popular
                            </div>
                        </div>

                        <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                            Unlimited (Best)
                        </h3>
                        <div className="mt-4 text-5xl font-black tracking-tight text-black">
                            ₹99.99
                        </div>

                        <div className="mt-6 space-y-2 text-xs font-bold text-black/70">
                            <p>• No content ID</p>
                            <p>• Unlimited music videos</p>
                            <p>• Unlimited streams</p>
                            <p>• WAV + Stems</p>
                        </div>

                        <button className="mt-8 w-full rounded bg-black py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition-colors shadow-lg">
                            Read License
                        </button>

                        <div className="mt-8 space-y-1 text-[10px] font-bold uppercase tracking-widest text-black">
                            <p>Bulk deals:</p>
                            <p>Buy 3 Tracks, Get 2 Free!</p>
                        </div>
                    </div>

                    {/* EXCLUSIVE PLAN */}
                    <div className="min-w-[80%] snap-center rounded-xl border border-white/10 bg-transparent p-6 sm:min-w-0 transition-transform duration-300 scale-95 md:scale-100">
                        <div className="mb-4 text-[10px] uppercase tracking-widest text-white/40 opacity-0">
                            Placeholder
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                            Exclusive
                        </h3>
                        <div className="mt-4 text-3xl font-black uppercase tracking-tight text-white">
                            Make an Offer
                        </div>

                        <div className="mt-6 space-y-2 text-xs font-medium text-white/60">
                            <p>• Full Ownership</p>
                            <p>• Unlimited Distribution</p>
                            <p>• Unlimited Commercial Use</p>
                            <p>• Track Removed</p>
                        </div>

                        <button className="mt-8 w-full rounded bg-[#222] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#333] transition-colors">
                            Read License
                        </button>

                        <div className="mt-8 space-y-1 text-[10px] font-bold uppercase tracking-widest text-white opacity-0">
                            <p>Bulk deals:</p>
                            <p>Placeholder</p>
                        </div>
                    </div>

                </div>

                {/* Mobile Dots Indicator */}
                <div className="flex justify-center gap-2 mt-4 md:hidden">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-doz-red w-4' : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
