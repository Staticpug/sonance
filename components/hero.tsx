export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft drifting glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute -left-24 -top-24 size-[34rem] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, oklch(0.75 0.11 292 / 0.5), transparent 70%)',
            animation: 'drift 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -right-20 top-24 size-[28rem] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, oklch(0.82 0.09 40 / 0.5), transparent 70%)',
            animation: 'drift 22s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 md:pb-24 md:pt-28">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          A quiet place for hard days
        </p>

        <h1 className="max-w-4xl text-balance font-serif text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
          Music that doesn&apos;t ask you to feel better.
          <span className="text-primary"> It just sits with you.</span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Undertone is a gentle listening space for anxious, heavy, and
          restless days. Choose how you feel, and let a soft, evolving
          soundscape hold that feeling — no fixing, no pressure.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#soundscapes"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Choose a soundscape
          </a>
          <a
            href="#breathe"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Breathe with me first
          </a>
        </div>
      </div>
    </section>
  )
}
