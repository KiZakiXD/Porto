export type NetworkId = "robinhood" | "base" | "solana";
export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  focus: string[];
  featured: boolean;
};
export const profile = {
  name: "KIZAKIXD",
  github: "https://github.com/KiZakiXD",
  role: "Web3 developer / Blockchain architect / Support team",
  introduction:
    "I build the systems behind onchain experiences. From contract architecture to the last interaction, I care about how every part works together.",
  collaboration: {
    company: "Xiaomi",
    product: "MiMo AI",
    relationship: "AI collaboration",
    roles: ["Core Support Team", "AI Prompter", "Beta Tester"],
    description:
      "Prompt engineering, core beta testing, and AI behavior optimization for Xiaomi’s MiMo AI. A hands-on role connecting model behavior with real user expectations.",
  },
};
export const networks = [
  {
    id: "robinhood" as const,
    name: "Robinhood Chain",
    label: "ETHEREUM / ROBINHOOD",
    count: "08",
    suffix: "+ 03",
    metric: "selected explorations",
    description:
      "Security, financial infrastructure, and useful onchain products. Eight highlighted projects and three further experiments.",
    logo: "/brands/robinhood.svg",
    symbol: "/brands/robinhood-symbol.svg",
  },
  {
    id: "base" as const,
    name: "Base",
    label: "ETHEREUM / BASE",
    count: "31",
    suffix: "+",
    metric: "projects & contributions",
    description:
      "A growing body of work across Base. Smart-contract thinking meets considered interfaces and practical developer infrastructure.",
    logo: "/brands/base.svg",
    symbol: "/brands/base-symbol.svg",
  },
  {
    id: "solana" as const,
    name: "Solana",
    label: "SOLANA ECOSYSTEM",
    count: "16",
    suffix: "",
    metric: "projects developed",
    description:
      "High-throughput dApps with responsive interfaces, efficient transaction flows, and a focus on low-latency experiences.",
    logo: "/brands/solana.svg",
    symbol: "/brands/solana-symbol.svg",
  },
];
export const projects: Project[] = [
  {
    id: "999security",
    name: "999Security",
    category: "Onchain security",
    description:
      "A protocol designed to identify flash-loan attack patterns and support real-time risk mitigation. Clear threat signals, fast response, and resilient contract logic.",
    focus: ["Threat detection", "Contract security", "Monitoring"],
    featured: true,
  },
  {
    id: "nextsol",
    name: "NextSol",
    category: "Real-world assets",
    description:
      "An RWA tokenization platform connecting asset ownership with decentralized infrastructure. Designed around understandable ownership flows and accessible financial interfaces.",
    focus: ["RWA", "Tokenization", "Ownership flows"],
    featured: true,
  },
  {
    id: "coreblock-nexus",
    name: "CoreBlock Nexus",
    category: "Blockchain infrastructure",
    description:
      "Infrastructure exploring cross-chain finality and node consensus. The focus: distributed coordination that is efficient, observable, and easier to reason about.",
    focus: ["Consensus", "Cross-chain", "Infrastructure"],
    featured: true,
  },
  {
    id: "aerostake",
    name: "AeroStake",
    category: "Liquid staking",
    description:
      "A liquid-staking protocol built around flexible capital access and automated compounding, with protocol and liquidity risks made visible in the product experience.",
    focus: ["Liquid staking", "Compounding", "DeFi"],
    featured: true,
  },
  {
    id: "robinyield",
    name: "RobinYield",
    category: "AI-assisted DeFi",
    description:
      "An AI-assisted aggregator for comparing Ethereum yield opportunities. Strategy signals, yield information, and risk context brought into one decision-making interface.",
    focus: ["AI analysis", "Yield aggregation", "Risk context"],
    featured: true,
  },
  {
    id: "zksync-vault",
    name: "ZKSync Vault",
    category: "Zero-knowledge wallet",
    description:
      "A privacy-focused wallet concept exploring zero-knowledge systems and rollup infrastructure. Selective disclosure, efficient transactions, and legible self-custody.",
    focus: ["Zero knowledge", "Rollups", "Self-custody"],
    featured: true,
  },
  {
    id: "novadex",
    name: "NovaDEX",
    category: "Decentralized exchange",
    description:
      "An exchange interface with intelligent liquidity routing designed to reduce price impact. Execution paths and trading trade-offs stay clear throughout the experience.",
    focus: ["Liquidity routing", "Exchange UX", "DeFi"],
    featured: true,
  },
  {
    id: "nebulapay",
    name: "NebulaPay",
    category: "Web3 payments",
    description:
      "A payment gateway for cross-border settlement and enterprise microtransactions. Efficient flows, clear transaction states, and practical integration.",
    focus: ["Payments", "Settlement", "Integration"],
    featured: true,
  },
  {
    id: "astrolend",
    name: "AstroLend",
    category: "Decentralized lending",
    description:
      "A lending-pool concept focused on clear collateral information and understandable borrowing positions.",
    focus: ["Lending", "Collateral", "Borrowing"],
    featured: false,
  },
  {
    id: "quantumoracle",
    name: "QuantumOracle",
    category: "Oracle infrastructure",
    description:
      "Decentralized data feeds designed for fast delivery and tamper-resistant verification between external information and smart contracts.",
    focus: ["Data feeds", "Verification", "Smart contracts"],
    featured: false,
  },
  {
    id: "galacticnode",
    name: "GalacticNode",
    category: "RPC infrastructure",
    description:
      "Decentralized RPC infrastructure exploring resilient node access, observability, and dependable application connectivity.",
    focus: ["RPC", "Node operations", "Observability"],
    featured: false,
  },
];
export function mockLinks(id: string) {
  return {
    github: `https://github.com/YOUR_GITHUB_USERNAME/${id}`,
    live: `https://${id}-demo.vercel.app`,
  };
}
export const chapters = [
  { id: "arrival", label: "Arrival" },
  { id: "perspective", label: "Perspective" },
  { id: "networks", label: "Networks" },
  { id: "intelligence", label: "Intelligence" },
  { id: "work", label: "Selected work" },
  { id: "contact", label: "Contact" },
];
