import { Waves } from 'lucide-react'

const links = [
  { href: '#soundscapes', label: 'Soundscapes' },
  { href: '#breathe', label: 'Breathe' },
  { href: '#affirmations', label: 'Affirmations' },
  { href: '#support', label: 'Support' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Waves className="size-4" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg tracking-tight">Undertone</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#support"
          className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-secondary-foreground"
        >
          Need to talk?
        </a>
      </div>
    </header>
  )
}
