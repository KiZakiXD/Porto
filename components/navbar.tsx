"use client"

import { useState, useEffect } from "react"
import { Menu, X, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // Active section detection
      const sections = ["home", "about", "skills", "projects", "contact"]
      const scrollPosition = window.scrollY + 150

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          if (scrollPosition >= offsetTop) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string, sectionName: string) => {
    setIsMenuOpen(false)
    setActiveSection(sectionName)

    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const navLinks = [
    { name: "Home", href: "#home", section: "home" },
    { name: "About", href: "#about", section: "about" },
    { name: "Skills", href: "#skills", section: "skills" },
    { name: "Projects", href: "#projects", section: "projects" },
    { name: "Contact", href: "#contact", section: "contact" },
  ]

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? isDark
            ? "bg-gray-900/90 backdrop-blur-xl py-3 border-b border-gray-800/50 shadow-lg"
            : "bg-white/90 backdrop-blur-xl py-3 border-b border-gray-200/50 shadow-lg"
          : isDark
            ? "bg-gray-900/50 backdrop-blur-md py-5"
            : "bg-white/50 backdrop-blur-md py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#home", "home")}
            className={`flex items-center gap-3 text-xl font-bold transition-all duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            } hover:text-orange-500 group cursor-pointer`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="font-black tracking-tight">KIZAKIXD</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href, link.section)}
                className={`rounded-xl font-semibold px-6 py-2 transition-all duration-300 cursor-pointer ${
                  activeSection === link.section
                    ? "text-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg border border-orange-200 dark:border-orange-800"
                    : isDark
                      ? "text-white hover:text-orange-400 hover:bg-gray-800/50"
                      : "text-gray-900 hover:text-orange-500 hover:bg-gray-100/50"
                } hover:scale-105`}
              >
                {link.name}
              </button>
            ))}

            <div className="flex items-center gap-3 ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`rounded-xl transition-all duration-300 hover:scale-105 ${
                isDark
                  ? "text-white hover:text-orange-400 hover:bg-gray-800/50"
                  : "text-gray-900 hover:text-orange-500 hover:bg-gray-100/50"
              }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden mt-4 p-6 rounded-2xl animate-in fade-in slide-in-from-top duration-300 ${
              isDark
                ? "bg-gray-900/95 backdrop-blur-xl border border-gray-800/50 shadow-2xl"
                : "bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl"
            }`}
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href, link.section)}
                  className={`text-left rounded-xl font-semibold px-6 py-3 transition-all duration-300 cursor-pointer ${
                    activeSection === link.section
                      ? "text-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg border border-orange-200 dark:border-orange-800"
                      : isDark
                        ? "text-white hover:text-orange-400 hover:bg-gray-800/50"
                        : "text-gray-900 hover:text-orange-500 hover:bg-gray-100/50"
                  } hover:scale-105`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
