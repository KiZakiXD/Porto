import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import './orbit.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://kizakixd.my.id'),
  title: 'KIZAKIXD — Orbital Works',
  description: 'Selected development by Aldi Zakia Pratama. Explore projects across Ethereum ecosystems, Solana concepts, and AI in an interactive planetary portfolio.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'KIZAKIXD — Orbital Works',
    description: 'A universe of projects, experiments, and things in progress.',
    siteName: 'KIZAKIXD',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#080b0d' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}><body>{children}</body></html>
}
