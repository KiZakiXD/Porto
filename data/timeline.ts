export interface TimelineEntry {
  id: string
  year: string
  title: string
  description: string
}

// Only years with confirmed repository activity are included.
// These are dated records, not invented employment or project launch dates.
export const timeline: TimelineEntry[] = [
  {
    id: "chat-automation-2022",
    year: "2022",
    title: "Learning through chat automation",
    description: "Worked on Chitanda-Public, a community-based Node.js messaging bot, exploring commands, media utilities, and the mechanics of an always-on tool.",
    // Chitanda-Public: be8307ded047e0246a35cd4ecad6b14aa34e39f7, 2022-05-15.
  },
  {
    id: "model-integration-2023",
    year: "2023",
    title: "Bringing AI into everyday tools",
    description: "Maintained a public WhatsApp AI bot that connects messaging to a model API, alongside small developer experiments such as UserAgent-Generator.",
    // OpenAi: e69019ef42dd20fcaa9b1749536b0b788ec71c60, 2023-01-08.
    // UserAgent-Generator: f86aab0e3f185b5da8e1e39da9d60b21daa8a4e5, 2023-06-03.
  },
  {
    id: "api-tooling-2024",
    year: "2024",
    title: "APIs and reusable foundations",
    description: "Explored modular API routes, middleware, and Swagger documentation through BaseAPI, an adaptation of a credited Express starter.",
    // BaseAPI: fb47e0d765bc7af8a2b50dc1ba064532f839abc5, 2024-06-08.
  },
  {
    id: "connected-systems-2026",
    year: "2026",
    title: "Connected systems and onchain interfaces",
    description: "Built out OfficeAi's agent workspace, market interfaces for NextFly and XYPHER, and the SOLMERA asset-interface concept. The archive brings those different strands together.",
    // OfficeAi b706564f (2026-10-05), NextFly c6274e5b (2026-09-27),
    // SOLMERA 99250e13 (2026-09-15), XYPHER config whitepaperDate 2026-09-13.
  },
]
