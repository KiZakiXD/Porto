import { Cloud, Feather } from "lucide-react"

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
    items: ["Memecoin tooling", "EVM", "Token workflows", "Base", "Robinhood Chain", "Team collaboration"],
  },
  {
    title: "Web & infrastructure",
    description: "The engineering layer that connects interfaces, APIs, automation, and deployment.",
    items: ["Next.js", "TypeScript", "Node.js", "REST APIs", "AWS", "Alibaba Cloud", "Git"],
  },
]

type PlatformKind = "deepseek" | "aws" | "base" | "robinhood" | "google" | "alibaba"

const platforms: Array<{ name: string; detail: string; kind: PlatformKind }> = [
  { name: "DeepSeek", detail: "AI models", kind: "deepseek" },
  { name: "AWS", detail: "Cloud + AI", kind: "aws" },
  { name: "Base", detail: "Onchain L2", kind: "base" },
  { name: "Robinhood Chain", detail: "Onchain L2", kind: "robinhood" },
  { name: "Google for Developers", detail: "Developer tools", kind: "google" },
  { name: "Alibaba Cloud", detail: "Cloud + AI", kind: "alibaba" },
]

function PlatformMark({ kind }: { kind: PlatformKind }) {
  if (kind === "deepseek") {
    return (
      <svg viewBox="0 0 64 48" className="h-9 w-9" aria-hidden="true">
        <path
          fill="#4d6bfe"
          d="M5 25.3C5 14 14.6 6.8 27.3 6.8c7 0 12.6 1.9 17.1 5.8 2.6-4.8 7-7.7 13.4-7.7-1.2 5.8.2 10 4.8 13.1-3.4 5.2-8.6 7.7-15.7 7.2C42.4 34.7 33.4 41 22 41 12 41 5 34.8 5 25.3Z"
        />
        <path
          fill="white"
          d="M11.5 26.6c7.3-3.5 14.3-1.5 19.6 5.3 3.8 4.8 8.1 7.2 13.1 7.1-5.7 4.1-13.8 5.3-21.5 2.7-7.2-2.4-11.1-7.3-11.2-15.1Z"
        />
        <circle cx="22.3" cy="18.6" r="2.1" fill="white" />
      </svg>
    )
  }
  if (kind === "aws") return <Cloud className="h-7 w-7 text-[#ff9900]" aria-hidden="true" />
  if (kind === "robinhood") return <Feather className="h-7 w-7 text-[#00c805]" aria-hidden="true" />

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

  if (kind === "alibaba") {
    return (
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M12 7H6v18h6M20 7h6v18h-6" stroke="#ff6a00" strokeWidth="3" strokeLinecap="round" />
        <path d="M10 16h12" stroke="#ff6a00" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  return null
}

export default function SkillsSection() {
  return (
    <section id="skills" className="section-shell bg-card py-20 md:py-28">
      <div className="container">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <p className="section-kicker pt-2">02 / Capabilities</p>
          <div>
            <h2 className="scroll-type-in display-title max-w-6xl text-[clamp(3.15rem,8vw,7.5rem)]">
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

        <div className="mt-16 border-y border-border py-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="section-kicker">Current orbit / Teams &amp; ecosystems</p>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground">
              Moving through the systems behind the work
            </p>
          </div>

          <div className="overflow-hidden border-y border-border bg-background">
            <div className="collaboration-track py-2" aria-hidden="true">
              {[...platforms, ...platforms].map((platform, index) => (
                <div
                  key={`${platform.name}-${index}`}
                  className="group flex min-w-[14.5rem] items-center gap-4 border-r border-border px-5 py-4 md:min-w-[18rem] md:px-7"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-card transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                    <PlatformMark kind={platform.kind} />
                  </div>
                  <div>
                    <p className="text-base font-semibold tracking-[-0.035em]">{platform.name}</p>
                    <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {platform.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <span className="sr-only">
              DeepSeek, AWS, Base, Robinhood Chain, Google for Developers, and Alibaba Cloud.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
