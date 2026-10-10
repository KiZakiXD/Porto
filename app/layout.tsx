import type { Metadata } from "next"
import type { ReactNode } from "react"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kizakixd.my.id'),
  title: "KizakiXD — Ideas into Orbit",
  description:
    "Explore the universe of Aldi Zakia Pratama: Web3 websites and launch support across Robinhood Chain, Base, and Solana, plus AI prompting and beta testing with Xiaomi / MiMo AI.",
  alternates: { canonical: '/' },
  openGraph: { title: 'KizakiXD — Ideas into Orbit', description: 'Web3 development. AI exploration. A personal universe.', url: '/', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'KizakiXD — Ideas into Orbit' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <a href="#work" className="skip-link">Skip to selected work</a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

