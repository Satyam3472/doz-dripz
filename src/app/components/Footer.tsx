"use client"
import { AudioWaveform, Radio, Users, Podcast } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Footer() {
    const pathname = usePathname()
    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <footer className="border-t border-white/5 bg-white py-10 dark:bg-background-dark">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
                    <div className="col-span-2 flex flex-col gap-4 md:col-span-1 lg:col-span-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-doz-red">
                                <AudioWaveform className="h-4 w-4 text-white" />
                            </div>
                            <h2 className="text-lg font-extrabold uppercase tracking-tighter text-slate-900 dark:text-white">
                                DOZ <span className="text-doz-red">DRIPZ</span>
                            </h2>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-white/50">
                            Industry leading production for independent artists and labels
                            worldwide. Experience the drip.
                        </p>
                        <div className="flex gap-4">
                            <a
                                className="text-slate-400 transition-colors hover:text-doz-red"
                                href="#"
                            >
                                <Radio className="h-5 w-5" />
                            </a>
                            <a
                                className="text-slate-400 transition-colors hover:text-doz-red"
                                href="#"
                            >
                                <Users className="h-5 w-5" />
                            </a>
                            <a
                                className="text-slate-400 transition-colors hover:text-doz-red"
                                href="#"
                            >
                                <Podcast className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
                            Shop
                        </h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-white/70">
                            <li>
                                <a className="hover:text-doz-red" href="#">
                                    New Releases
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-doz-red" href="#">
                                    Top Charts
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-doz-red" href="#">
                                    Drum Kits
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-doz-red" href="#">
                                    Sound Kits
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
                            Support
                        </h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-white/70">
                            <li>
                                <a className="hover:text-doz-red" href="#">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-doz-red" href="#">
                                    Licensing Info
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-doz-red" href="#">
                                    Refund Policy
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-doz-red" href="#">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-100 pt-6 text-center text-xs uppercase tracking-widest text-slate-400 dark:border-white/5 dark:text-white/30">
                    © 2026 DOZ DRIPZ Production Group. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
