import LicensingPlans from './components/LicensingPlans'
import ContactSection from './components/ContactSection'
import { getAllTracks } from './lib/repositories/track.repo'
import FeaturedBeatsTable from './components/FeaturedBeatsTable'
import { Search, SkipBack, Pause, SkipForward, Volume2 } from 'lucide-react'
import MediaPlayer from './components/MediaPlayer'

export const dynamic = 'force-dynamic';

export default function LandingPage() {
  const tracks = getAllTracks();
  console.log({ tracks });
  return (
    <main>
      <section className="relative flex min-h-[auto] flex-col items-center justify-start overflow-hidden px-4 pb-12 pt-28 md:min-h-[85vh] md:justify-center md:px-6 md:py-20">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-doz-red/5 via-transparent to-transparent dark:via-background-dark dark:to-background-dark" />
        <div className="relative z-10 flex w-full max-w-[960px] flex-col items-center gap-4 text-center md:gap-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 md:text-4xl lg:text-6xl dark:text-white">
              DOZ <span className="text-doz-red">DRIPZ</span>
            </h1>
          </div>
          <MediaPlayer />
          <FeaturedBeatsTable initialTracks={tracks} />
        </div>
      </section>
      <LicensingPlans />
      <ContactSection />
    </main>
  )
}
