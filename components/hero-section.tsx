import Link from "next/link"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import UtcClock from "@/components/utc-clock"

const tickerItems = ["AI development", "Security research", "Automation", "Onchain products"]

export default function HeroSection() {
  const ticker = [...tickerItems, ...tickerItems]

  return (
    <section id="home" className="editorial-grid relative overflow-hidden bg-transparent pt-16">
      <div className="container relative z-10 flex min-h-[calc(100svh-4rem)] flex-col">
        <div className="grid border-b border-border lg:grid-cols-[1fr_auto] lg:items-stretch">
          <div className="meta-copy flex flex-col justify-center gap-3 py-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:pr-6">
            <span className="flex items-center gap-2.5 text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Available for selected projects
            </span>
            <span>AI · Security · Onchain</span>
          </div>
          <UtcClock />
        </div>

        <div className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[5rem_1fr] lg:py-16">
          <div className="meta-copy hidden h-full items-center justify-center border-r border-border text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground lg:flex">
            <span className="[writing-mode:vertical-rl]">Portfolio / Volume 26</span>
          </div>

          <div>
            <p className="section-kicker mb-7">Aldi Zakia Pratama / AI · Security · Onchain</p>
            <h1
              className="display-title text-[clamp(3.7rem,16.4vw,10.5rem)]"
              aria-label="Code with character. Built to work."
            >
              <span className="type-reveal block" style={{ animationDelay: "80ms" }}>Code with</span>
              <span className="type-reveal display-italic block text-primary" style={{ animationDelay: "160ms" }}>character.</span>
              <span className="type-reveal mt-[0.08em] block text-right" style={{ animationDelay: "240ms" }}>Built to</span>
              <span className="type-reveal block text-right" style={{ animationDelay: "320ms" }}>
                <span className="kinetic-outline display-outline block">work.</span>
              </span>
            </h1>
          </div>
        </div>

        <div className="grid gap-7 border-t border-border py-7 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-10">
          <span className="meta-copy text-xs text-muted-foreground">[ 01 — 26 ]</span>
          <p className="max-w-2xl text-lg leading-[1.55] tracking-[-0.02em] text-muted-foreground md:text-xl">
            Developer working across AI systems, security research, automation, and experimental onchain products.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-4 md:justify-end">
            <Link
              href="#projects"
              className="group inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-semibold"
            >
              Selected work
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 border-b border-border pb-1 text-sm font-semibold text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-y border-border bg-foreground py-3 text-background">
        <div className="marquee-track" aria-hidden="true">
          {ticker.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="font-mono text-xs font-semibold uppercase tracking-[0.18em]"
            >
              {item}
              <span className="mx-8 text-primary">✦</span>
            </span>
          ))}
        </div>
        <span className="sr-only">AI development, security research, automation, and onchain products.</span>
      </div>
    </section>
  )
}
