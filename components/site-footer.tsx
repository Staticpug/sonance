import { Waves } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center">
        <span className="flex items-center gap-2 font-serif text-lg">
          <Waves className="size-4 text-primary" aria-hidden="true" />
          Undertone
        </span>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Made gently, for anyone having a hard time. Take what helps and leave
          the rest.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Not medical advice. If you&apos;re in danger, please contact your
          local emergency services.
        </p>
      </div>
    </footer>
  )
}
