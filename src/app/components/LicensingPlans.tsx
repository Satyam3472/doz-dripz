"use client"
import { Star, Check, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function LicensingPlans() {
    const [licenses, setLicenses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const [selectedLicense, setSelectedLicense] = useState<any>(null);

    useEffect(() => {
        fetchLicenses()
    }, [])

    const fetchLicenses = async () => {
        try {
            const res = await fetch('/api/admin/licenses')
            if (res.ok) {
                const data = await res.json()
                setLicenses(data)
                // Set initial active index to the popular one if exists, else middle
                const popularIndex = data.findIndex((l: any) => l.isPopular)
                if (popularIndex !== -1) setActiveIndex(popularIndex)
            }
        } catch (error) {
            console.error("Failed to fetch licenses", error)
        } finally {
            setLoading(false)
        }
    }

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

    // Scroll to the popular item on mount for mobile
    useEffect(() => {
        const container = scrollContainerRef.current
        if (container && window.innerWidth < 768 && licenses.length > 0) { // md breakpoint
            const popularIndex = licenses.findIndex((l: any) => l.isPopular)
            const targetIndex = popularIndex !== -1 ? popularIndex : 1 // Default to 2nd item if no popular

            // Wait for render
            setTimeout(() => {
                const children = Array.from(container.children) as HTMLElement[]
                if (children[targetIndex]) {
                    const child = children[targetIndex]
                    // Calculate position to center the child
                    const scrollPos = child.offsetLeft - (container.clientWidth / 2) + (child.offsetWidth / 2)
                    container.scrollTo({ left: scrollPos, behavior: 'smooth' })
                }
            }, 100)
        }
    }, [licenses])

    if (loading) return null; // Or a skeleton

    return (
        <section className="bg-[#050505] py-20 text-white">
            <div className="mx-auto max-w-[1000px] px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Licensing Info
                    </h2>
                </div>

                {/* MODAL */}
                {selectedLicense && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedLicense(null)}>
                        <div className="bg-[#121212] border border-white/10 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => setSelectedLicense(null)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-white">{selectedLicense.name} License</h3>
                            <div className="prose prose-invert prose-sm max-w-none text-white/80 whitespace-pre-wrap">
                                {selectedLicense.details || "No additional details available for this license."}
                            </div>
                        </div>
                    </div>
                )}

                {/* Container: Scrollable on mobile, Grid on desktop */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex w-full snap-x snap-mandatory items-center sm:items-stretch gap-4 overflow-x-auto pb-8 text-center hide-scrollbar md:grid md:grid-cols-3 md:items-center md:pb-0 md:overflow-visible md:gap-6"
                >
                    {licenses.filter(l => l.isActive).map((license, index) => {
                        const isPopular = license.isPopular;
                        const isExclusive = license.priceType === 'hidden';

                        // Exact classes from original static version
                        const containerClasses = isPopular
                            ? "relative min-w-[80%] snap-center rounded-xl bg-white p-8 text-black shadow-2xl sm:min-w-0 scale-100 md:scale-110"
                            : "min-w-[80%] snap-center rounded-xl border border-white/10 bg-transparent p-6 sm:min-w-0 transition-transform duration-300 scale-95 md:scale-100";

                        const titleClasses = `text-sm font-bold uppercase tracking-wide ${isPopular ? 'text-black' : 'text-white'}`;

                        const priceContainerClasses = isExclusive
                            ? "mt-4 text-3xl font-black uppercase tracking-tight text-white" // Exclusive specific
                            : isPopular
                                ? "mt-4 text-5xl font-black tracking-tight text-black" // Unlimited specific
                                : "mt-4 text-4xl font-black tracking-tight text-white"; // Standard specific

                        const featuresContainerClasses = `mt-6 space-y-2 text-xs ${isPopular ? 'font-bold text-black/70' : 'font-medium text-white/60'}`;

                        const buttonClasses = isPopular
                            ? "mt-8 w-full rounded bg-black py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/80 transition-colors shadow-lg"
                            : "mt-8 w-full rounded bg-[#222] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#333] transition-colors";

                        return (
                            <div key={license.id} className={containerClasses}>
                                {isPopular && (
                                    <div className="mb-4 flex justify-center">
                                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black/60">
                                            <Star className="h-3 w-3 fill-black text-black" /> Popular
                                        </div>
                                    </div>
                                )}

                                {isExclusive && (
                                    <div className="mb-4 text-[10px] uppercase tracking-widest text-white/40 opacity-0">
                                        Placeholder
                                    </div>
                                )}

                                <h3 className={titleClasses}>
                                    {license.name}
                                </h3>

                                <div className={priceContainerClasses}>
                                    {isExclusive ? 'Make an Offer' : (
                                        <>
                                            {license.priceType === 'starting' && <span className="text-xs align-top mr-1">FROM</span>}
                                            ₹{license.price}
                                        </>
                                    )}
                                </div>

                                <div className={featuresContainerClasses}>
                                    {license.features.map((feature: string, i: number) => (
                                        <p key={i}>• {feature}</p>
                                    ))}
                                </div>

                                <button
                                    className={buttonClasses}
                                    onClick={() => setSelectedLicense(license)}
                                >
                                    Read License
                                </button>

                                {license.bulk_deals ? (
                                    <div className={`mt-8 space-y-1 text-[10px] font-bold uppercase tracking-widest ${isPopular ? 'text-black' : 'text-[#FFF]'}`}>
                                        <p>Bulk deals:</p>
                                        <p className={`${isPopular ? '' : 'text-doz-red'}`}>{license.bulk_deals}</p>
                                    </div>
                                ) : (
                                    // Placeholder for alignment if no deals, but exclusive had specific opacity-0 placeholder
                                    isExclusive ? (
                                        <div className="mt-8 space-y-1 text-[10px] font-bold uppercase tracking-widest text-white opacity-0">
                                            <p>Bulk deals:</p>
                                            <p>Placeholder</p>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Mobile Dots Indicator */}
                <div className="flex justify-center gap-2 mt-4 md:hidden">
                    {licenses.filter(l => l.isActive).map((_, i) => (
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
