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
}

// Summaries use repository READMEs/manifests inspected on 2026-10-06.
// Private repositories contribute only a short project description, never source or credentials.
// Years identify confirmed repository activity, not unverified launch dates.
export const projects: Project[] = [
  {
    id: "office-ai",
    title: "OfficeAi",
    category: "AI / SYSTEMS",
    summary: "A virtual office connected to real AI workflows.",
    description: "A 3D team workspace with agent assignments, a mission board, and a model directory. The backend preserves task progress, retries temporary failures, and connects the interface to a private model gateway. Source remains private.",
    technologies: ["Next.js", "TypeScript", "Three.js", "Node.js", "SQLite"],
    year: "2026",
    status: "Active development",
    relationship: "PERSONAL PROJECT",
    links: [{ label: "Discuss project", href: "mailto:aldizakiapratama@gmail.com?subject=OfficeAi%20project" }],
  },
  {
    id: "xypher",
    title: "XYPHER",
    category: "ONCHAIN / DATA",
    summary: "A research workspace for market and liquidity data.",
    description: "Token discovery, network filters, a local watchlist, price history, and exportable order-book estimates. Server-side adapters preserve missing-data states. The implemented product provides research tools; autonomous trading remains a development direction.",
    technologies: ["JavaScript", "Node.js", "REST APIs", "Serverless functions"],
    year: "2026",
    status: "Research interface",
    relationship: "PERSONAL PROJECT",
    links: [{ label: "Discuss project", href: "mailto:aldizakiapratama@gmail.com?subject=XYPHER%20project" }],
  },
  {
    id: "nextfly",
    title: "NextFly",
    category: "WEB / MARKET TOOLS",
    summary: "Price, liquidity, and activity in one market interface.",
    description: "A market-intelligence website with token metrics, provider fallbacks, and a configurable data layer. Quote timestamps and unavailable metrics stay visible so the interface reflects the data actually returned by its sources.",
    technologies: ["JavaScript", "Node.js", "Market APIs", "CSS"],
    year: "2026",
    status: "Market interface",
    relationship: "PERSONAL PROJECT",
    // Public domain supplied by the owner; it is not a private repository link.
    links: [{ label: "Website", href: "https://nextfly.app" }],
  },
  {
    id: "solmera",
    title: "SOLMERA",
    category: "FRONTEND / RWA",
    summary: "An interface concept for energy assets onchain.",
    description: "A product prototype combining an asset explorer, digital asset passports, and an interactive solar cash-flow model. It explores solar, storage, and EV infrastructure on Robinhood Chain. Reference assets are fictional; this is a concept, not an operating investment product.",
    technologies: ["Next.js", "React", "Tailwind CSS", "Wallet integration"],
    year: "2026",
    status: "Concept prototype",
    relationship: "EXPERIMENT",
    links: [{ label: "Discuss project", href: "mailto:aldizakiapratama@gmail.com?subject=SOLMERA%20project" }],
  },
  {
    id: "base-api",
    title: "BaseAPI",
    category: "DEVELOPER TOOLS",
    summary: "An Express API starter with a Swagger playground.",
    description: "A public API project exploring modular routes, middleware, static resources, and interactive endpoint documentation. Adapted from an existing API base credited in the source. The project name is unrelated to the Base blockchain.",
    technologies: ["Node.js", "Express", "Swagger", "JavaScript"],
    year: "2024",
    status: "Code archive",
    relationship: "OPEN SOURCE",
    links: [{ label: "View code", href: "https://github.com/KiZakiXD/BaseAPI" }],
  },
  {
    id: "whatsapp-ai",
    title: "WhatsApp AI Bot",
    category: "AI / AUTOMATION",
    summary: "An early model-API experiment inside a chat workflow.",
    description: "A public Node.js bot integrating the OpenAI API with WhatsApp messaging through Baileys. It supports automatic replies and a command-based mode. Preserved as an earlier learning project; its dependencies and API integration reflect that period.",
    technologies: ["Node.js", "JavaScript", "OpenAI API", "Baileys"],
    year: "2023",
    status: "Code archive",
    relationship: "OPEN SOURCE",
    links: [{ label: "View code", href: "https://github.com/KiZakiXD/OpenAi" }],
  },
]
