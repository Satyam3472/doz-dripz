import { ArrowRight } from 'lucide-react'

export default function ContactSection() {
    return (
        <section className="bg-black py-24 text-white">
            <div className="mx-auto max-w-[600px] px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">
                        Get In Touch
                    </h2>
                    <p className="mt-2 text-sm text-white/50">
                        Ready to take your sound to the next level?
                    </p>
                </div>

                <form className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                            className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-0"
                            placeholder="NAME"
                            type="text"
                        />
                        <input
                            className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-0"
                            placeholder="EMAIL"
                            type="email"
                        />
                    </div>
                    <textarea
                        className="w-full rounded-lg border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-0"
                        placeholder="MESSAGE"
                        rows={6}
                    />
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-black uppercase tracking-wider text-black transition-transform hover:scale-[1.02] active:scale-[0.98]">
                        Send Message
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </section>
    )
}
