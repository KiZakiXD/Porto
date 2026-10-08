export type ProjectCategory =
  | "Security"
  | "RWA"
  | "Infrastructure"
  | "DeFi"
  | "Payments";
export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  line: string;
  description: string;
  focus: string[];
  accent: string;
  symbol:
    | "shield"
    | "cube"
    | "nodes"
    | "orbit"
    | "wave"
    | "lock"
    | "exchange"
    | "spark";
  featured: boolean;
  mockLinks: { github: string; live: string };
}

const records: Omit<Project, "mockLinks">[] = [
  {
    id: "999security",
    name: "999Security",
    category: "Security",
    line: "See the threat. Secure the chain.",
    description:
      "An onchain security protocol designed to detect flash-loan attack patterns and support real-time risk mitigation. Built around clear signals, fast response, and resilient contract design.",
    focus: ["Threat detection", "Onchain monitoring", "Risk mitigation"],
    accent: "#91ddc5",
    symbol: "shield",
    featured: true,
  },
  {
    id: "nextsol",
    name: "NextSol",
    category: "RWA",
    line: "Real assets. Onchain possibilities.",
    description:
      "A real-world asset tokenization platform connecting traditional financial assets with decentralized infrastructure. A focused approach to asset representation, ownership flows, and accessible Web3 interfaces.",
    focus: ["Asset tokenization", "Ownership flows", "dApp experience"],
    accent: "#a2aaff",
    symbol: "cube",
    featured: true,
  },
  {
    id: "coreblock-nexus",
    name: "CoreBlock Nexus",
    category: "Infrastructure",
    line: "The foundation beneath the next block.",
    description:
      "Core blockchain infrastructure exploring cross-chain finality and node consensus. Designed to make distributed coordination more understandable, observable, and efficient.",
    focus: ["Cross-chain finality", "Node consensus", "System architecture"],
    accent: "#93beef",
    symbol: "nodes",
    featured: true,
  },
  {
    id: "aerostake",
    name: "AeroStake",
    category: "DeFi",
    line: "Put staked capital in motion.",
    description:
      "A liquid-staking protocol designed around flexible capital access and automated compounding. A streamlined staking experience with explicit attention to protocol and liquidity risks.",
    focus: ["Liquid staking", "Automated compounding", "Protocol interfaces"],
    accent: "#edbb8f",
    symbol: "orbit",
    featured: true,
  },
  {
    id: "robinyield",
    name: "RobinYield",
    category: "DeFi",
    line: "Intelligence for a changing yield landscape.",
    description:
      "An AI-assisted yield aggregator for comparing opportunities across Ethereum. Brings strategy signals, yield information, and risk context into a single decision-making interface.",
    focus: ["Strategy aggregation", "AI-assisted analysis", "Risk visibility"],
    accent: "#bcdf82",
    symbol: "wave",
    featured: true,
  },
  {
    id: "zksync-vault",
    name: "ZKSync Vault",
    category: "Security",
    line: "A more private way to move.",
    description:
      "A privacy-focused wallet concept using zero-knowledge technology and rollup infrastructure. Explores lower-cost transactions, selective disclosure, and a clearer self-custody experience.",
    focus: ["Zero-knowledge systems", "Self-custody", "Rollup transactions"],
    accent: "#c7a4fa",
    symbol: "lock",
    featured: true,
  },
  {
    id: "novadex",
    name: "NovaDEX",
    category: "DeFi",
    line: "A clearer route through liquidity.",
    description:
      "A decentralized exchange interface with intelligent routing designed to reduce price impact. Makes execution paths, liquidity, and trading trade-offs easier to understand.",
    focus: ["Liquidity routing", "Execution design", "Exchange interfaces"],
    accent: "#8fd8e7",
    symbol: "exchange",
    featured: true,
  },
  {
    id: "nebulapay",
    name: "NebulaPay",
    category: "Payments",
    line: "Value moves beyond borders.",
    description:
      "A Web3 payment gateway for cross-border settlement and enterprise microtransactions. Focused on efficient payment flows, clear transaction states, and practical integration.",
    focus: [
      "Cross-border payments",
      "Microtransactions",
      "Payment integration",
    ],
    accent: "#eab1ce",
    symbol: "spark",
    featured: true,
  },
  {
    id: "astrolend",
    name: "AstroLend",
    category: "DeFi",
    line: "A new orbit for decentralized lending.",
    description:
      "A decentralized lending-pool concept with a space-inspired interface, legible borrowing positions, and clear collateral information.",
    focus: ["Lending pools", "Collateral visibility", "Borrowing interfaces"],
    accent: "#a5baff",
    symbol: "orbit",
    featured: false,
  },
  {
    id: "quantumoracle",
    name: "QuantumOracle",
    category: "Infrastructure",
    line: "Reliable signals for smart contracts.",
    description:
      "Decentralized data-feed infrastructure designed for fast delivery and tamper-resistant verification. Connects external information to contract-level decisions.",
    focus: [
      "Decentralized feeds",
      "Data verification",
      "Contract integrations",
    ],
    accent: "#91ddc5",
    symbol: "nodes",
    featured: false,
  },
  {
    id: "galacticnode",
    name: "GalacticNode",
    category: "Infrastructure",
    line: "Keep the network within reach.",
    description:
      "A decentralized RPC infrastructure concept focused on resilient node access, service observability, and dependable application connectivity.",
    focus: ["RPC infrastructure", "Node operations", "Observability"],
    accent: "#edbb8f",
    symbol: "cube",
    featured: false,
  },
];

// These URL strings are deliberately non-navigable in the interface.
// Replace them with verified destinations before enabling outbound project links.
export const projects: Project[] = records.map((project) => ({
  ...project,
  mockLinks: {
    github: `https://github.com/YOUR_GITHUB_USERNAME/${project.id}`,
    live: `https://${project.id}-demo.vercel.app`,
  },
}));

export const portfolio = {
  name: "KIZAKIXD",
  role: "Web3 developer · Blockchain architect · Support team",
  introduction:
    "I turn ambitious ideas into onchain experiences — from core blockchain systems to the interfaces people actually use.",
  github: "https://github.com/KiZakiXD",
  collaboration: {
    company: "Xiaomi",
    product: "MiMo AI",
    type: "Key partnership",
    title: "Human intuition.\nMachine potential.",
    description:
      "Supporting the development of Xiaomi’s MiMo AI through prompt engineering, core beta testing, and AI behavior optimization. Bringing a developer’s precision and a tester’s curiosity to every iteration.",
    roles: ["Core Support Team", "AI Prompter", "Beta Tester"],
  },
  ecosystems: [
    {
      id: "base",
      name: "Base",
      count: 31,
      suffix: "+",
      label: "PROJECTS & CONTRIBUTIONS",
      description:
        "Building across the Base ecosystem — bringing smart-contract thinking and thoughtful product engineering to an expanding onchain world.",
    },
    {
      id: "solana",
      name: "Solana",
      count: 16,
      suffix: "",
      label: "PROJECTS DEVELOPED",
      description:
        "High-throughput applications with a focus on responsive interfaces, efficient transaction flows, and low-latency dApp experiences.",
    },
  ],
  capabilities: [
    {
      number: "01",
      title: "Architect the foundation.",
      description:
        "Core blockchain systems, contract logic, and infrastructure designed as one connected whole.",
      tag: "BLOCKCHAIN ARCHITECTURE",
    },
    {
      number: "02",
      title: "Make complexity feel simple.",
      description:
        "Fast, considered dApp interfaces that turn technical systems into useful human experiences.",
      tag: "WEB3 DEVELOPMENT",
    },
    {
      number: "03",
      title: "Improve the next iteration.",
      description:
        "Hands-on support, purposeful prompt engineering, and beta testing that surfaces what matters.",
      tag: "AI & TECHNICAL SUPPORT",
    },
  ],
};
