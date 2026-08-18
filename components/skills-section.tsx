import { BrainCircuit, Cloud, Feather, Github } from "lucide-react"

const groups = [
  {
    title: "AI systems",
    description: "Model integrations and workflows that turn repetitive work into useful, dependable systems.",
    items: ["AI development", "AI automation", "AI learning", "Agents", "DeepSeek API", "Prompt systems"],
  },
  {
    title: "Security research",
    description: "Hands-on web security practice focused on finding, understanding, and reporting real weaknesses.",
    items: ["Cybersecurity", "Bug bounty", "Recon", "Web security", "Vulnerability research", "Responsible disclosure"],
  },
  {
    title: "Onchain development",
    description: "Experimental products and automation for EVM, token, and memecoin communities.",
    items: ["Memecoin tooling", "EVM", "Token workflows", "Base", "Ethereum", "Robinhood Chain"],
  },
  {
    title: "Web & infrastructure",
    description: "The engineering layer that connects interfaces, APIs, automation, and deployment.",
    items: ["Next.js", "TypeScript", "Node.js", "REST APIs", "AWS", "Vercel", "Git"],
  },
]

type PlatformKind = "deepseek" | "aws" | "base" | "ethereum" | "robinhood" | "google" | "github" | "vercel"

const platforms: Array<{ name: string; detail: string; kind: PlatformKind }> = [
  { name: "DeepSeek", detail: "AI models", kind: "deepseek" },
  { name: "AWS", detail: "Cloud + AI", kind: "aws" },
  { name: "Base", detail: "Ethereum L2", kind: "base" },
  { name: "Ethereum", detail: "Onchain", kind: "ethereum" },
  { name: "Robinhood Chain", detail: "Ethereum L2", kind: "robinhood" },
  { name: "Google for Developers", detail: "Developer tools", kind: "google" },
  { name: "GitHub", detail: "Source + teams", kind: "github" },
  { name: "Vercel", detail: "Web platform", kind: "vercel" },
]

function PlatformMark({ kind }: { kind: PlatformKind }) {
  if (kind === "deepseek") return <BrainCircuit className="h-7 w-7 text-[#4d6bfe]" aria-hidden="true" />
  if (kind === "aws") return <Cloud className="h-7 w-7 text-[#ff9900]" aria-hidden="true" />
  if (kind === "robinhood") return <Feather className="h-7 w-7 text-[#00c805]" aria-hidden="true" />
  if (kind === "github") return <Github className="h-7 w-7" aria-hidden="true" />

  if (kind === "google") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M13 5 5 16" stroke="#4285f4" strokeWidth="3.2" strokeLinecap="round" />
        <path d="m5 16 8 11" stroke="#ea4335" strokeWidth="3.2" strokeLinecap="round" />
        <path d="m19 5 8 11" stroke="#fbbc04" strokeWidth="3.2" strokeLinecap="round" />
        <path d="m27 16-8 11" stroke="#34a853" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    )
  }

  if (kind === "base") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#0052ff" />
        <path d="M6.5 16h19" stroke="white" strokeWidth="3.2" />
      </svg>
    )
  }

  if (kind === "ethereum") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <path d="M16 2 7.5 16 16 21l8.5-5L16 2Z" fill="#8a92b2" />
        <path d="m7.5 17.8 8.5 12.1 8.5-12.1-8.5 5-8.5-5Z" fill="#62688f" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <path d="M16 4 29 27H3L16 4Z" fill="currentColor" />
    </svg>
  )
}

export default function SkillsSection() {
  return (
    <section id="skills" className="section-shell bg-card py-20 md:py-28">
      <div className="container">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <p className="section-kicker pt-2">02 / Capabilities</p>
          <div>
            <h2 className="display-title max-w-6xl text-[clamp(3.15rem,8vw,7.5rem)]">
              <span className="block">Building across</span>
              <span className="display-italic block text-primary">systems.</span>
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              AI, security, onchain experiments, and web engineering are different lanes connected by the same habit:
              learn the system, test it, then build something useful.
            </p>
          </div>
        </div>

        <div className="grid border-l border-t border-border md:grid-cols-2">
          {groups.map((group, index) => (
            <article key={group.title} className="group border-b border-r border-border p-6 md:p-8">
              <span className="font-mono text-[0.65rem] text-muted-foreground">0{index + 1}</span>
              <h3 className="mt-8 text-2xl font-semibold uppercase leading-none tracking-[-0.055em] transition-colors group-hover:text-primary md:text-3xl">
                {group.title}
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{group.description}</p>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                {group.items.map((item) => (
                  <span key={item} className="border-b border-border pb-1 transition-colors group-hover:border-foreground/50">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="section-kicker">Platforms / Ecosystems</p>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground">
              Tools and ecosystems—not partnership claims
            </p>
          </div>

          <div className="grid grid-cols-2 border-l border-border sm:grid-cols-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="flex min-h-32 flex-col justify-between border-b border-r border-border p-4 md:min-h-36 md:p-5">
                <PlatformMark kind={platform.kind} />
                <div className="mt-7">
                  <p className="text-sm font-semibold tracking-[-0.025em]">{platform.name}</p>
                  <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {platform.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
