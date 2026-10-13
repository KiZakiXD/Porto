import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/site";
import "./globals.css";
const display = localFont({
  src: "./fonts/Syne-ExtraBold.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "800",
});
const heading = localFont({
  src: "./fonts/Syne-Bold.ttf",
  variable: "--font-heading",
  display: "swap",
  weight: "700",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KIZAKIXD — Beyond the Block",
  description:
    "Web3 development, core blockchain architecture, and AI collaboration. Explore a portfolio of security, infrastructure, DeFi, and onchain experiences.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "KIZAKIXD — Beyond the Block",
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
  themeColor: "#11100e",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} ${heading.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
