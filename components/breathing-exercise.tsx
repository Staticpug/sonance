'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Phase = { key: 'in' | 'hold' | 'out'; label: string; seconds: number }

const cycle: Phase[] = [
  { key: 'in', label: 'Breathe in', seconds: 4 },
  { key: 'hold', label: 'Hold', seconds: 4 },
  { key: 'out', label: 'Breathe out', seconds: 6 },
]

export function BreathingExercise() {
  const [active, setActive] = useState(false)
  const [index, setIndex] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) return
    const phase = cycle[index]
    timer.current = setTimeout(
      () => setIndex((i) => (i + 1) % cycle.length),
      phase.seconds * 1000,
    )
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [active, index])

  const phase = cycle[index]
  const scale = !active ? 0.7 : phase.key === 'out' ? 0.62 : 1

  return (
    <section
      id="breathe"
      className="scroll-mt-20 border-y border-border/50 bg-secondary/30"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
        <div>
          <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
            When the sound isn&apos;t enough, breathe.
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Anxiety lives in fast, shallow breaths. This simple rhythm — in for
            four, hold for four, out for six — tells your nervous system it&apos;s
            safe to slow down. Follow the circle for as long as you like.
          </p>
          <button
            type="button"
            onClick={() => {
              setActive((a) => !a)
              setIndex(0)
            }}
            className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {active ? 'Stop' : 'Start breathing'}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative flex size-72 items-center justify-center md:size-80">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, oklch(0.72 0.11 292 / 0.5), transparent 70%)',
                transform: `scale(${scale})`,
                transition: `transform ${phase.seconds}s ease-in-out`,
              }}
            />
            <div
              className="flex size-56 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-accent/70 text-center md:size-64"
              style={{
                transform: `scale(${scale})`,
                transition: active
                  ? `transform ${phase.seconds}s ease-in-out`
                  : 'transform 1s ease-in-out',
              }}
            >
              <span className="font-serif text-2xl font-light text-primary-foreground">
                {active ? phase.label : 'Ready?'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
