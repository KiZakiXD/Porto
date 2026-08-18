"use client"

import { useEffect, useRef, useState } from "react"
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
  const firstMobileLinkRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160

      for (let index = navLinks.length - 1; index >= 0; index--) {
        const link = navLinks[index]
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

  useEffect(() => {
    if (!isMenuOpen) return

    const body = document.body
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const desktopQuery = window.matchMedia("(min-width: 768px)")

    body.style.overflow = "hidden"
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    const focusFrame = window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus())

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false)
    }

    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    desktopQuery.addEventListener("change", closeOnDesktop)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
      window.removeEventListener("keydown", closeOnEscape)
      desktopQuery.removeEventListener("change", closeOnDesktop)
    }
  }, [isMenuOpen])

  const goTo = (href: string, section: string) => {
    setIsMenuOpen(false)
    setActiveSection(section)
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => goTo("#home", "home")}
            className="font-mono text-sm font-semibold uppercase tracking-[-0.045em] transition-opacity hover:opacity-60"
            aria-label="Back to home"
          >
            KIZAKIXD
          </button>

          <div className="hidden items-center gap-7 md:flex">
            <nav className="flex items-center gap-6" aria-label="Primary navigation">
              {navLinks.map((link, index) => (
                <button
                  type="button"
                  key={link.section}
                  onClick={() => goTo(link.href, link.section)}
                  className={`relative py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    activeSection === link.section ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="mr-1.5 text-[0.6rem] text-muted-foreground">0{index + 1}</span>
                  {link.name}
                  {activeSection === link.section ? (
                    <span className="absolute inset-x-0 -bottom-[13px] h-px bg-primary" />
                  ) : null}
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
              className="grid h-10 w-10 place-items-center border border-border transition-colors hover:border-foreground"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          className="editorial-grid fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto overscroll-contain bg-background md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="container flex min-h-full flex-col justify-between py-5">
            <div>
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.section

                return (
                  <button
                    type="button"
                    key={link.section}
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    onClick={() => goTo(link.href, link.section)}
                    className="group flex w-full items-baseline justify-between border-b border-border py-2.5 text-left"
                  >
                    <span
                      className={`display-title text-[clamp(2rem,9.5vw,3rem)] transition-colors ${
                        isActive ? "text-primary" : "group-hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </span>
                    <span className="font-mono text-[0.65rem] text-muted-foreground">0{index + 1}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-border pt-5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              <span>Portfolio / 2026</span>
              <span className="flex items-center gap-2 text-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Available
              </span>
            </div>
          </div>
        </nav>
      ) : null}
    </>
  )
}
