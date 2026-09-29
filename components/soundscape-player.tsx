'use client'

import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useAmbientPlayer } from '@/lib/use-ambient-player'
import { soundscapes } from '@/lib/soundscapes'
import { cn } from '@/lib/utils'

export function SoundscapePlayer() {
  const player = useAmbientPlayer()
  const { current, isPlaying, volume, setVolume, toggle, togglePlay } = player

  return (
    <>
      <section id="soundscapes" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:py-24">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl">
            How does today feel?
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            There&apos;s no wrong answer. Pick whatever is closest, and the
            sound will meet you there. You can switch any time.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {soundscapes.map((scape) => {
            const active = current?.id === scape.id
            const playing = active && isPlaying
            return (
              <button
                key={scape.id}
                type="button"
                onClick={() => toggle(scape)}
                aria-pressed={playing}
                className={cn(
                  'group relative overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300',
                  active
                    ? 'border-primary/50 shadow-lg shadow-primary/10'
                    : 'border-border hover:border-primary/30 hover:shadow-md',
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    'absolute -right-10 -top-10 size-40 rounded-full blur-2xl transition-opacity duration-500',
                    playing ? 'opacity-70' : 'opacity-30 group-hover:opacity-50',
                  )}
                  style={{ background: scape.gradient }}
                />

                <div className="relative flex h-full flex-col">
                  <div className="mb-6 flex items-start justify-between">
                    <span
                      className="size-11 rounded-full ring-1 ring-inset ring-white/20"
                      style={{ background: scape.gradient }}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        'flex size-11 items-center justify-center rounded-full transition-colors',
                        playing
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground group-hover:bg-primary/15 group-hover:text-primary',
                      )}
                    >
                      {playing ? (
                        <Pause className="size-4" aria-hidden="true" />
                      ) : (
                        <Play className="size-4 translate-x-px" aria-hidden="true" />
                      )}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-light tracking-tight">
                    {scape.name}
                  </h3>
                  <p className="text-sm italic text-primary/90">{scape.feeling}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {scape.description}
                  </p>
                  <p className="mt-5 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground/70">
                    {scape.helps}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Sticky now-playing bar */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-500',
          current ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="mx-auto max-w-3xl px-4 pb-4">
          <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/85 p-3 pr-4 shadow-xl shadow-black/5 backdrop-blur-xl">
            <button
              type="button"
              onClick={togglePlay}
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="size-5" aria-hidden="true" />
              ) : (
                <Play className="size-5 translate-x-px" aria-hidden="true" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-base leading-tight">
                {current?.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {isPlaying ? 'Playing softly' : 'Paused'} · {current?.feeling}
              </p>
            </div>

            <Waveform active={isPlaying} />

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setVolume(volume > 0 ? 0 : 0.55)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={volume > 0 ? 'Mute' : 'Unmute'}
              >
                {volume > 0 ? (
                  <Volume2 className="size-4" aria-hidden="true" />
                ) : (
                  <VolumeX className="size-4" aria-hidden="true" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
                className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-border accent-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Waveform({ active }: { active: boolean }) {
  const bars = [0.5, 0.85, 0.35, 1, 0.6, 0.9, 0.45]
  return (
    <div className="flex h-8 items-center gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-primary/80"
          style={{
            height: active ? `${h * 100}%` : '15%',
            transition: 'height 0.3s ease',
            animation: active
              ? `breathe-scale ${1.1 + i * 0.18}s ease-in-out ${i * 0.12}s infinite`
              : 'none',
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  )
}
