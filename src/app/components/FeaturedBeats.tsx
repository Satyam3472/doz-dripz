import { ArrowRight, Play, ShoppingCart } from 'lucide-react'

export default function FeaturedBeats() {
    const beats = [
        {
            title: 'Midnight Pulse',
            bpm: '140 BPM',
            genre: 'Trap',
            price: '$29.99',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAvnIxeS9np_Y_ot-S4turuSlcjNd_QRmctJzwKxB3S7EuAZ2EG5rNZsjTEiwSLg5Tu0JsAPSr6l3dcw6u9k0gyg-OnTwfxl6q32eukSKjFKmlAP_0tOyh62QsiD9_IjWc5t9CqFJWYK5CXgyqI7i82sCwG3KHXsIOiSUsi0UUrEnyqTiofNyGQ31_27A02S7mEZns4BzOyUCD7sbs-HhpWySi2d4xb8STrDxkR1cr5rZlMMptIiiYvbyzONE46p10ik_LiwIGkAsw',
        },
        {
            title: 'Neon Dreams',
            bpm: '128 BPM',
            genre: 'Pop',
            price: '$29.99',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDDtEvXCJ_x1gw44f1TDj2p1fn9OCXQuq08oacQkT1RtDeOytzuGXoN9SXKXI1irpuM7ROqX06gxKVH4L93Z-5w4dYlImnRveVSvhXbrpy4zYMciw0g96IOp66EZyN3CfY_agBZNRBK93l1YJlBpoarSVAP7AyCCsyz1CEmcrE4RjeTZt88grpe0ncHQCes2kz282uSKwlh7bl4MHwUX-L-X53ciVxilMY0v1fV8kWrvaUtyFVPOteJHQYsETQj6oziEDP0-n1xdsI',
        },
        {
            title: 'Ethereal Flow',
            bpm: '95 BPM',
            genre: 'R&B',
            price: '$29.99',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuA7iLlS73nJ3HUyQXy_hVDdH1GDAdBG_UlhSD8Pg4CASrneTSTTNP5uR1M-VoBK2NewhcM5nQ6TK842P2DbQfaIvqZnHNWdTAsq7kPCAxlkABlEYK5Efbkg8at5AaoEDGWisDgiJnMeqN23cm9DYDQEWzceR6bM3RW6Xw3Rc_UQwV3j54hucvo0a-31ETB7npGbDubYxpxrgXN8Z1yeU0BDy89DDQrzZMBYdyzFcKQSYcjTK5EmbSb-fgDgXAxdmTNId25XXod9nr4',
        },
        {
            title: 'Dark Knight',
            bpm: '145 BPM',
            genre: 'Drill',
            price: '$29.99',
            image:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCbQnMcCOCGqDJsS1qZi6JcfiX7k4VNfooiEHNowo-9xlZOVww80pdM19qYYODOeZgZkNqg8sdHc-bOfNGqkFshN-iAiK3Pmp64hrrs0QYA5a50lAwUKBpQ8km9eYeWm8DRNc6KG9HNS8tpYUV2WisyNZ62oveY0PVpqoR8vjhAHqiUMrrzfsK1gkr4xr5TqCbKU9YCT4qehIlTYjEe4lo8qChIwGgBvnP8nI7LSkHHiCL9uv0cR3GR2vUyHV-ZJ7VUISa_SXI0sl8',
        },
    ]

    return (
        <section className="mx-auto max-w-[1200px] px-6 py-16">
            <div className="mb-10 flex items-center justify-between border-l-4 border-doz-red pl-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Featured Beats
                    </h2>
                    <p className="text-slate-500 dark:text-white/50">
                        Hand-picked selections for your next hit.
                    </p>
                </div>
                <a
                    className="flex items-center gap-1 text-sm font-semibold text-doz-red hover:underline"
                    href="#"
                >
                    View All Tracks{' '}
                    <ArrowRight className="h-4 w-4" />
                </a>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {beats.map((beat, i) => (
                    <div
                        key={i}
                        className="group relative flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-doz-red/30 hover:shadow-2xl dark:border-white/5 dark:bg-card-dark"
                    >
                        <div
                            className="relative aspect-square overflow-hidden rounded-lg bg-cover bg-center"
                            style={{ backgroundImage: `url("${beat.image}")` }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                <button className="flex h-14 w-14 transform items-center justify-center rounded-full bg-doz-red text-white shadow-xl transition-transform scale-90 group-hover:scale-100">
                                    <Play className="h-8 w-8 fill-current" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                                {beat.title}
                            </h3>
                            <div className="flex justify-between text-sm text-slate-500 dark:text-white/50">
                                <span>
                                    {beat.bpm} - {beat.genre}
                                </span>
                                <span className="font-bold text-doz-red">{beat.price}</span>
                            </div>
                        </div>
                        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-bold text-slate-900 transition-colors hover:border-doz-red hover:bg-doz-red hover:text-white dark:border-white/10 dark:text-white">
                            <ShoppingCart className="h-4 w-4" />{' '}
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}
