export type RelationshipType =
  | "TEAM"
  | "TEAM SUPPORT"
  | "CONTRIBUTOR"
  | "ECOSYSTEM"
  | "CLIENT"
  | "TECHNOLOGY"
  | "OPEN SOURCE"
  | "EXPERIMENT"
  | "PERSONAL PROJECT"

export interface Relationship {
  id: string
  name: string
  type: RelationshipType
  summary: string
  zone: "ai-lab" | "onchain"
  url?: string
}

// The owner clarified the ecosystem/support relationships in the redesign brief.
// Xiaomi and MiMo involvement is preserved from components/skills-section.tsx.
export const relationships: Relationship[] = [
  { id: "base", name: "Base", type: "ECOSYSTEM", summary: "Onchain product experiments and tooling in the Base ecosystem.", zone: "onchain" },
  { id: "robinhood-chain", name: "Robinhood Chain", type: "ECOSYSTEM", summary: "Web interfaces and tooling for projects exploring Robinhood Chain.", zone: "onchain" },
  { id: "pons-family", name: "Pons Family", type: "TEAM SUPPORT", summary: "Previously part of the support team around the crypto launching ecosystem.", zone: "onchain" },
  { id: "xiaomi", name: "Xiaomi", type: "CONTRIBUTOR", summary: "Practical IT support work associated with Xiaomi.", zone: "ai-lab" },
  { id: "mimo-ai", name: "MiMo AI", type: "CONTRIBUTOR", summary: "Involvement in AI model-development work connected to Xiaomi / MiMo.", zone: "ai-lab" },
]
