import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  title: "KizakiXD — Developer Portfolio",
  description: "Portfolio of Aldi Zakia Pratama (KizakiXD), a developer from Kudus focused on web, automation, AI, and practical software projects.",
  metadataBase: new URL("https://www.kizakixd.my.id"),
  openGraph: {
    title: "KizakiXD — Developer Portfolio",
    description: "Web, automation, AI, and practical software projects by Aldi Zakia Pratama.",
    url: "https://www.kizakixd.my.id",
    siteName: "KizakiXD",
    locale: "en_US",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f2ed" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
