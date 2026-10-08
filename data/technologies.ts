export interface TechnologyGroup {
  id: string
  name: string
  items: string[]
}

// Capabilities retained from the production portfolio and repository manifests.
export const technologies: TechnologyGroup[] = [
  { id: "ai", name: "AI & automation", items: ["Model APIs", "Agent workflows", "Python", "Node.js", "Prompt systems"] },
  { id: "web", name: "Web engineering", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST APIs"] },
  { id: "onchain", name: "Onchain tools", items: ["EVM", "Token workflows", "Market interfaces", "Community tooling"] },
  { id: "systems", name: "Systems & practice", items: ["Git", "Linux", "Deployment", "Web security", "Responsible disclosure"] },
]
