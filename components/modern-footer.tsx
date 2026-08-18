import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const socials = [
  ["GitHub", "https://github.com/KiZakiXD"],
  ["Instagram", "https://instagram.com/iamkizakixd"],
  ["Facebook", "https://www.facebook.com/share/1BxtFbdeZF/"],
  ["WhatsApp", "https://wa.me/6285147107687?text=Hi..."],
]

export default function ModernFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="section-shell overflow-hidden bg-foreground text-background">
      <div className="container py-10 md:py-12">
        <p className="section-kicker text-background/50">End / Start again</p>
        <p className="display-title mt-8 whitespace-nowrap text-[clamp(4.15rem,15.8vw,13rem)] leading-[0.72] tracking-[-0.09em]">
          KIZAKI<span className="display-outline-primary">XD.</span>
        </p>

        <div className="mt-12 flex flex-col gap-8 border-t border-background/20 pt-7 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-sm leading-6 text-background/60">
            Personal portfolio for experiments, selected work, and things worth building next.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {socials.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-background/65 transition-colors hover:text-background"
              >
                {label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-background/20 pt-5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-background/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} Aldi Zakia Pratama</span>
          <span>Designed & built by KizakiXD</span>
        </div>
      </div>
    </footer>
  )
}
