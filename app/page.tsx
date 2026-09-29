import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { SoundscapePlayer } from '@/components/soundscape-player'
import { BreathingExercise } from '@/components/breathing-exercise'
import { Affirmations } from '@/components/affirmations'
import { SupportNote } from '@/components/support-note'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="pb-28">
        <Hero />
        <SoundscapePlayer />
        <BreathingExercise />
        <Affirmations />
        <SupportNote />
      </main>
      <SiteFooter />
    </div>
  )
}
