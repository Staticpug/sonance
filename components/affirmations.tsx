'use client'

import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

const affirmations = [
  'You do not have to be okay to be worthy of rest.',
  'This feeling is a visitor, not a resident. It will move through.',
  'Getting through today counts. That is enough.',
  'You are allowed to take up space, exactly as you are right now.',
  'Your worth was never tied to your productivity.',
  'Breathing is a start. You already began.',
  'It makes sense that this is hard. You are carrying a lot.',
  'You have survived every worst day so far. That is a quiet kind of strength.',
  'You are not behind. You are on your own tender timeline.',
  'Reaching out is brave, not weak. So is staying.',
]

export function Affirmations() {
  const [i, setI] = useState(0)

  return (
    <section id="affirmations" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          A small reminder
        </p>
        <blockquote className="text-balance font-serif text-3xl font-light leading-snug tracking-tight md:text-5xl">
          &ldquo;{affirmations[i]}&rdquo;
        </blockquote>

        <button
          type="button"
          onClick={() => setI((p) => (p + 1) % affirmations.length)}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Another one
        </button>
      </div>
    </section>
  )
}
