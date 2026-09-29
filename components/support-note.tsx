import { HeartHandshake, Phone } from 'lucide-react'

const lines = [
  { region: 'US', detail: 'Call or text 988 — Suicide & Crisis Lifeline' },
  { region: 'UK & ROI', detail: 'Call Samaritans at 116 123' },
  { region: 'Worldwide', detail: 'Find a helpline at findahelpline.com' },
]

export function SupportNote() {
  return (
    <section id="support" className="scroll-mt-20 px-5 pb-24">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12">
        <div className="flex items-center gap-3 text-primary">
          <HeartHandshake className="size-6" aria-hidden="true" />
          <span className="text-sm font-medium uppercase tracking-wider">
            You deserve support
          </span>
        </div>

        <h2 className="mt-5 max-w-2xl text-balance font-serif text-3xl font-light leading-snug tracking-tight md:text-4xl">
          Undertone is here to soften the hard moments — but it isn&apos;t a
          substitute for a real person.
        </h2>
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          If things feel too heavy to hold alone, please reach out. Talking to
          someone is not an overreaction, and you never need to be in crisis to
          deserve help.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {lines.map((l) => (
            <li
              key={l.region}
              className="rounded-2xl border border-border/70 bg-background/50 p-4"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                <Phone className="size-3.5" aria-hidden="true" />
                {l.region}
              </span>
              <p className="mt-1.5 text-sm leading-snug text-foreground/85">
                {l.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
