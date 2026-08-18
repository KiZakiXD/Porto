import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const socials = [
  ["GitHub", "https://github.com/KiZakiXD"],
  ["Instagram", "https://instagram.com/iamkizakixd"],
  ["Facebook", "https://www.facebook.com/share/1BxtFbdeZF/"],
  ["WhatsApp", "https://wa.me/+15812592235"],
]

export default function ModernFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="section-shell overflow-hidden bg-foreground text-background">
      <div className="container py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-sm leading-6 text-background/60">
            Selected work is being prepared. Reach out if you would like to build something useful together.
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
          <span>Independent developer portfolio</span>
        </div>
      </div>
    </footer>
  )
}
