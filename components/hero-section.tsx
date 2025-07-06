"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen pt-16 md:pt-20 bg-gradient-to-br from-white via-gray-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] md:min-h-[80vh] text-center space-y-6 md:space-y-8">
          {/* Status Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Badge
              variant="outline"
              className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Available for work
            </Badge>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>📍 Kudus, Indonesia</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight">
              <span className="text-gray-900 dark:text-white">I'M </span>
              <span className="bg-gradient-to-r from-orange-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ZAKI
              </span>
            </h1>
            <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 leading-relaxed px-4">
              UI Designer, AI Learning &<br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Web3 Developer
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl px-4">
            Student at SMK WISUDA KARYA with 3+ years of passion in technology and programming. Specializing in modern
            web development and emerging technologies.
          </p>

          {/* Stats */}
          <div className="flex gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500">3+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-500">10+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-500">100%</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Client Satisfaction</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none px-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <Link href="#projects">
                <ArrowRight className="mr-2 h-5 w-5" />
                View My Work
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-500 px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-transparent w-full sm:w-auto"
            >
              <Link href="#contact">Let's Talk</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
