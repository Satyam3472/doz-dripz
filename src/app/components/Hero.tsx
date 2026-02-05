import { Search, SkipBack, Pause, SkipForward, Volume2 } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 py-20">
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-doz-red/5 via-transparent to-transparent dark:via-background-dark dark:to-background-dark" />
            <div className="relative z-10 flex w-full max-w-[960px] flex-col items-center gap-10 text-center">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 md:text-6xl lg:text-8xl dark:text-white">
                        DOZ <span className="text-doz-red">DRIPZ</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-sm md:text-lg text-slate-600 dark:text-white/70">
                        Premium beats for the modern music industry. Elevate your sound with
                        industry-standard production from top-tier producers.
                    </p>
                </div>
                <div className="w-full max-w-2xl">
                    <div className="flex h-16 w-full items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl transition-all focus-within:border-doz-red/50 dark:border-white/10 dark:bg-white/5 backdrop-blur-sm">
                        <div className="flex items-center px-4 text-slate-400 dark:text-white/50">
                            <Search className="h-6 w-6" />
                        </div>
                        <input
                            className="w-full border-none bg-transparent text-lg text-slate-900 focus:ring-0 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30"
                            placeholder="Search for beats..."
                            type="text"
                        />
                        <button className="m-2 rounded-lg bg-doz-red px-4 md:px-8 font-bold text-white shadow-lg shadow-doz-red/20 transition-all hover:bg-doz-red/90 active:scale-95">
                            Search
                        </button>
                    </div>
                </div>

                {/* Waveform Animation */}
                <div className="mb-2 flex h-12 w-full max-w-2xl items-end justify-center gap-1.5 px-4">
                    {[
                        { delay: 'delay-1', height: '40%' },
                        { delay: 'delay-3', height: '60%' },
                        { delay: 'delay-2', height: '80%' },
                        { delay: 'delay-5', height: '45%' },
                        { delay: 'delay-4', height: '70%' },
                        { delay: 'delay-1', height: '30%' },
                        { delay: 'delay-2', height: '55%' },
                        { delay: 'delay-3', height: '85%' },
                        { delay: 'delay-4', height: '40%' },
                        { delay: 'delay-5', height: '65%' },
                        { delay: 'delay-1', height: '90%' },
                        { delay: 'delay-2', height: '50%' },
                        { delay: 'delay-3', height: '75%' },
                        { delay: 'delay-4', height: '35%' },
                        { delay: 'delay-5', height: '60%' },
                        { delay: 'delay-1', height: '85%' },
                        { delay: 'delay-2', height: '45%' },
                        { delay: 'delay-3', height: '70%' },
                        { delay: 'delay-4', height: '95%' },
                        { delay: 'delay-5', height: '55%' },
                        { delay: 'delay-1', height: '40%' },
                        { delay: 'delay-3', height: '60%' },
                        { delay: 'delay-2', height: '80%' },
                    ].map((bar, i) => (
                        <div
                            key={i}
                            className={`w-1.5 rounded-full bg-doz-red animate-wave ${bar.delay}`}
                            style={{ height: bar.height }}
                        />
                    ))}
                </div>

                {/* Player UI */}
                <div className="flex w-full max-w-4xl flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-white/5 bg-card-dark p-4 shadow-2xl">
                    <div className="flex w-full md:w-auto items-center gap-4">
                        <div
                            className="h-12 w-12 rounded-lg border border-white/5 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvnIxeS9np_Y_ot-S4turuSlcjNd_QRmctJzwKxB3S7EuAZ2EG5rNZsjTEiwSLg5Tu0JsAPSr6l3dcw6u9k0gyg-OnTwfxl6q32eukSKjFKmlAP_0tOyh62QsiD9_IjWc5t9CqFJWYK5CXgyqI7i82sCwG3KHXsIOiSUsi0UUrEnyqTiofNyGQ31_27A02S7mEZns4BzOyUCD7sbs-HhpWySi2d4xb8STrDxkR1cr5rZlMMptIiiYvbyzONE46p10ik_LiwIGkAsw")',
                            }}
                        />
                        <div className="text-left flex-1 md:flex-none">
                            <h4 className="text-sm font-bold tracking-tight text-white">
                                DAREDEVIL
                            </h4>
                            <p className="text-[11px] font-medium uppercase tracking-wider text-doz-red">
                                DOZ DRIPZ
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full md:flex-1 items-center gap-6">
                        <div className="flex items-center gap-4 text-slate-400">
                            <button className="transition-colors hover:text-white">
                                <SkipBack className="h-5 w-5" />
                            </button>
                            <button className="flex h-10 w-10 transform items-center justify-center rounded-full bg-doz-red text-white shadow-lg shadow-doz-red/20 transition-transform hover:scale-105">
                                <Pause className="h-5 w-5 fill-current" />
                            </button>
                            <button className="transition-colors hover:text-white">
                                <SkipForward className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-1 items-center gap-3">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full w-[35%] rounded-full bg-doz-red" />
                            </div>
                            <span className="min-w-[70px] text-[10px] font-medium text-slate-400">
                                01:12 / 03:31
                            </span>
                        </div>
                    </div>
                    <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-6">
                        <div className="flex items-center gap-2">
                            <Volume2 className="h-5 w-5 text-slate-400" />
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full w-2/3 rounded-full bg-slate-400" />
                            </div>
                        </div>
                        <button className="rounded-lg bg-doz-red px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-doz-red/10 transition-all hover:bg-doz-red/90">
                            BUY ₹49.99
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
