"use client"
import { Facebook, Instagram, Github, MessageCircleMore } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ModernFooter() {
  const currentYear = new Date().getFullYear()

  // Partner logos data - Updated with purple Ethereum logo
  const partners = [
    { name: "Binance", logo: "/sponsors/binance-new.svg" },
    { name: "Ethereum", logo: "/sponsors/ethereum-purple.png" },
    { name: "Base", logo: "/sponsors/base-latest.png" },
    { name: "Gate Web3", logo: "/sponsors/gateweb3-new.png" },
    { name: "Polytron", logo: "/sponsors/polytron-new.png" },
    { name: "Nodepay", logo: "/sponsors/nodepay-new.png" },
    { name: "DeepSeek", logo: "/sponsors/deepseek-updated.svg" },
    { name: "Google Developers", logo: "/sponsors/google-developers-updated.svg" },
    { name: "Xiaomi", logo: "/sponsors/xiaomi-new.svg" },
  ]

  return (
    <>
      {/* Worked With Section - Theme Consistent */}
      <section className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="py-16">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-wider uppercase transition-colors duration-300">
              Worked With
            </h3>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent mx-auto mt-4 transition-colors duration-300"></div>
          </div>

          {/* Logo Carousel Container - Optimized for 9 logos */}
          <div className="relative overflow-hidden w-full">
            {/* Gradient Fade Effects */}
            <div className="absolute left-0 top-0 w-20 md:w-32 h-full bg-gradient-to-r from-white dark:from-gray-900 via-white/80 dark:via-gray-900/80 to-transparent z-10 pointer-events-none transition-colors duration-300"></div>
            <div className="absolute right-0 top-0 w-20 md:w-32 h-full bg-gradient-to-l from-white dark:from-gray-900 via-white/80 dark:via-gray-900/80 to-transparent z-10 pointer-events-none transition-colors duration-300"></div>

            {/* Standardized Grid-Based Carousel - Updated for 9 logos */}
            <div className="flex animate-seamless-scroll">
              {/* Triple the logos for perfect seamless looping */}
              {[...Array(3)].map((_, setIndex) => (
                <div
                  key={`set-${setIndex}`}
                  className="flex shrink-0"
                  style={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gap: "24px", // Uniform 24px spacing
                    alignItems: "center",
                  }}
                >
                  {partners.map((partner, index) => (
                    <div
                      key={`${setIndex}-${index}`}
                      className="group cursor-pointer"
                      style={{
                        width: "120px", // Fixed width for consistency
                        height: "80px", // Fixed height for consistency
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "12px",
                      }}
                    >
                      <Image
                        src={partner.logo || "/placeholder.svg"}
                        alt={partner.name}
                        width={96}
                        height={64}
                        className="w-auto h-12 md:h-14 max-w-[96px] object-contain filter grayscale opacity-60 dark:opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 ease-out group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Pure Black Background */}
      <footer className="w-full bg-black text-white">
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-8">
              {/* Brand */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="font-bold text-white text-xl">A</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-light tracking-wide text-white">kizakixd</span>
                  <span className="text-sm text-gray-300 font-light">Frontend Developer</span>
                </div>
              </div>

              {/* Social Media - Uniform Spacing with Flexbox Gap */}
              <div className="flex gap-6">
                <Link
                  href="https://www.facebook.com/share/1BxtFbdeZF/"
                  target="_blank"
                  className="group w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <Facebook className="h-6 w-6 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
                </Link>
                <Link
                  href="https://instagram.com/iamkizakixd"
                  target="_blank"
                  className="group w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20"
                >
                  <Instagram className="h-6 w-6 text-gray-300 group-hover:text-pink-400 transition-colors duration-300" />
                </Link>
                <Link
                  href="https://github.com/kizakixd"
                  target="_blank"
                  className="group w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-400/20"
                >
                  <Github className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                </Link>
                <Link
                  href="https://wa.me/6285147107687?text=Hi..."
                  target="_blank"
                  className="group w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/20"
                >
                  <MessageCircleMore className="h-6 w-6 text-gray-300 group-hover:text-green-400 transition-colors duration-300" />
                </Link>
              </div>

              {/* Copyright */}
              <div className="text-center">
                <div className="text-gray-400 text-sm font-light tracking-wide">
                  © {currentYear} | Design By <span className="text-white font-medium">kizakixd</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
