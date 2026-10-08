import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KIZAKIXD — Engineering New Worlds",
  description:
    "Web3 development, core blockchain architecture, and AI collaboration. Explore a portfolio of security, infrastructure, DeFi, and onchain experiences.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "KIZAKIXD — Engineering New Worlds",
    description: "Web3 developer. Blockchain architect. Human.",
    type: "website",
    locale: "en_US",
    siteName: "KIZAKIXD",
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06080d",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
