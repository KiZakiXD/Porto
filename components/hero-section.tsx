import Link from "next/link"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section id="home" className="editorial-grid min-h-screen bg-background pt-16">
      <div className="container flex min-h-[calc(100vh-4rem)] flex-col justify-between py-10 md:py-14">
        <div className="flex flex-col gap-4 border-b border-border pb-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2 text-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Available for selected projects
          </span>
          <span>Kudus, Indonesia · GMT+7</span>
        </div>

        <div className="py-16 md:py-24">
          <p className="section-kicker mb-6">Aldi Zakia Pratama / KizakiXD</p>
          <h1 className="display-title max-w-6xl text-balance text-[clamp(3.8rem,11vw,9rem)]">
            Building useful digital products
            <span className="text-primary"> without the noise.</span>
          </h1>

          <div className="mt-10 grid gap-8 border-t border-border pt-7 md:grid-cols-[1.4fr_1fr] md:items-end">
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Developer exploring web interfaces, automation, AI, and open-source tooling. I care about clear ideas,
              useful details, and software that feels intentional.
            </p>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Selected work <ArrowDownRight className="h-4 w-4" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-foreground"
              >
                Start a conversation <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 border-t border-border sm:grid-cols-3">
          {["Web interfaces", "Automation", "AI experiments"].map((item, index) => (
            <div
              key={item}
              className="flex items-center justify-between border-b border-border py-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"
            >
              <span className="font-heading text-lg font-medium">{item}</span>
              <span className="text-xs text-muted-foreground">0{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
