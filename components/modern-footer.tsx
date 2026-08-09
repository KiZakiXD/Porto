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
    <footer className="section-shell bg-foreground text-background">
      <div className="container py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-heading text-3xl font-medium tracking-[-0.05em]">KIZAKIXD<span className="text-primary">.</span></p>
            <p className="mt-2 max-w-md text-sm leading-6 text-background/60">
              Personal portfolio for experiments, selected work, and things worth building next.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {socials.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-background/65 transition-colors hover:text-background"
              >
                {label} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-background/20 pt-5 text-xs text-background/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} Aldi Zakia Pratama</span>
          <span>Designed & built by KizakiXD</span>
        </div>
      </div>
    </footer>
  )
}
