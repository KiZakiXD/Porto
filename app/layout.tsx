import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://kizakixd.my.id'),
  title: 'KIZAKIXD — The Developer Archive',
  description: 'Explore the developer archive of Aldi Zakia Pratama. AI systems, automation, onchain experiments, and selected software projects in an interactive world.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'KIZAKIXD — The Developer Archive',
    description: 'A small world of systems, experiments, and things built.',
    siteName: 'KIZAKIXD',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#101412' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}><body>{children}</body></html>
}
