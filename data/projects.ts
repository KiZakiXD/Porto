import type { SystemId } from "./orbit"
import type { PortfolioLink } from "./profile"
import type { RelationshipType } from "./relationships"

export interface Project {
  id: string
  title: string
  category: string
  summary: string
  description: string
  technologies: string[]
  year?: string
  links: PortfolioLink[]
  status?: string
  relationship?: RelationshipType
  system: SystemId
  kind: "development" | "concept"
  shortTag: string
  date?: { label: string; value: string }
}

// Real development records are owner-supplied; concepts are explicitly identified.
// See docs/project-provenance.md for verification scope and date semantics.
// description mirrors summary so all interfaces consume the same short record.
const records: Array<Omit<Project, "description">> = [
  {
    id: "9e9app",
    title: "9e9App",
    category: "Web3 application",
    summary: "Web3 application development within the Robinhood / Ethereum ecosystem.",
    technologies: [],
    links: [],
    status: "Development",
    relationship: "CONTRIBUTOR",
    system: "robinhood",
    kind: "development",
    shortTag: "WEB3 APPLICATION",
  },
  {
    id: "nextcard",
    title: "NextCard — Payment",
    category: "Payments",
    summary: "Payment-focused product development for the Robinhood / Ethereum ecosystem.",
    technologies: [],
    links: [],
    status: "Development",
    relationship: "CONTRIBUTOR",
    system: "robinhood",
    kind: "development",
    shortTag: "PAYMENTS",
  },
  {
    id: "nodepay",
    title: "NodePay",
    category: "Web3 development",
    summary: "Web3 development work included in this collection of Robinhood / Ethereum projects.",
    technologies: [],
    links: [],
    status: "Development",
    relationship: "CONTRIBUTOR",
    system: "robinhood",
    kind: "development",
    shortTag: "WEB3 DEVELOPMENT",
  },
  {
    id: "nextfly",
    title: "NextFly",
    category: "Market intelligence",
    summary: "A market-intelligence interface for tracking price, liquidity, and token activity around Robinhood Chain.",
    technologies: ["JavaScript", "Node.js", "Market APIs"],
    // The public domain is owner-supplied; private source links are excluded.
    links: [{ label: "Website", href: "https://nextfly.app" }],
    status: "Development",
    relationship: "PERSONAL PROJECT",
    system: "robinhood",
    kind: "development",
    shortTag: "MARKET INTELLIGENCE",
    // Confirmed September 2026 repository activity; not a founding or launch date.
    date: { label: "Development record", value: "Sep 2026" },
  },
  {
    id: "base-stillledger",
    title: "Stillledger",
    category: "Payment receipts",
    summary: "A concept for turning Base payments into clear, shareable receipts for independent work.",
    technologies: [],
    links: [],
    status: "Concept",
    relationship: "EXPERIMENT",
    system: "base",
    kind: "concept",
    shortTag: "RECEIPTS / CONCEPT",
  },
  {
    id: "base-threadwake",
    title: "Threadwake",
    category: "Wallet automation",
    summary: "A concept for following selected Base wallet events and organizing useful alerts into a quiet activity feed.",
    technologies: [],
    links: [],
    status: "Concept",
    relationship: "EXPERIMENT",
    system: "base",
    kind: "concept",
    shortTag: "AUTOMATION / CONCEPT",
  },
  {
    id: "solana-tidefolio",
    title: "Tidefolio",
    category: "Wallet activity",
    summary: "A concept for a readable Solana wallet journal that connects transactions, tokens, and personal notes.",
    technologies: [],
    links: [],
    status: "Concept",
    relationship: "EXPERIMENT",
    system: "solana",
    kind: "concept",
    shortTag: "WALLET JOURNAL / CONCEPT",
  },
  {
    id: "solana-softmint",
    title: "Softmint Studio",
    category: "Creator payments",
    summary: "A concept for a simple Solana payment page where creators can collect support and share digital releases.",
    technologies: [],
    links: [],
    status: "Concept",
    relationship: "EXPERIMENT",
    system: "solana",
    kind: "concept",
    shortTag: "CREATOR TOOLS / CONCEPT",
  },
]

export const projects: Project[] = records.map((record) => ({
  ...record,
  description: record.summary,
}))
