"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { name: "Home", href: "#home", section: "home" },
  { name: "About", href: "#about", section: "about" },
  { name: "Skills", href: "#skills", section: "skills" },
  { name: "Projects", href: "#projects", section: "projects" },
  { name: "Contact", href: "#contact", section: "contact" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const link = navLinks[i]
        const element = document.getElementById(link.section)
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(link.section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const goTo = (href: string, section: string) => {
    setIsMenuOpen(false)
    setActiveSection(section)
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/92 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <button
          type="button"
          onClick={() => goTo("#home", "home")}
          className="font-heading text-lg font-semibold tracking-[-0.04em] transition-opacity hover:opacity-60"
          aria-label="Back to home"
        >
          KIZAKIXD<span className="text-primary">.</span>
        </button>

        <div className="hidden items-center gap-7 md:flex">
          <nav className="flex items-center gap-6" aria-label="Primary navigation">
            {navLinks.map((link, index) => (
              <button
                type="button"
                key={link.section}
                onClick={() => goTo(link.href, link.section)}
                className={`relative py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                  activeSection === link.section ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="mr-1 text-[10px] text-muted-foreground">0{index + 1}</span>
                {link.name}
                {activeSection === link.section && (
                  <span className="absolute inset-x-0 -bottom-[13px] h-px bg-primary" />
                )}
              </button>
            ))}
          </nav>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center border border-border"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-border bg-background md:hidden" aria-label="Mobile navigation">
          <div className="container py-3">
            {navLinks.map((link, index) => (
              <button
                type="button"
                key={link.section}
                onClick={() => goTo(link.href, link.section)}
                className="flex w-full items-center justify-between border-b border-border py-4 text-left font-heading text-2xl font-medium last:border-b-0"
              >
                <span>{link.name}</span>
                <span className="text-xs font-sans text-muted-foreground">0{index + 1}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
