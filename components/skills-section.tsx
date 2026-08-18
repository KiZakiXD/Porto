import Image from "next/image"
import { Feather } from "lucide-react"

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
    items: ["Next.js", "TypeScript", "Node.js", "Python", "PHP", "REST APIs", "AWS", "Alibaba Cloud", "Git"],
  },
]

type CollaborationKind = "deepseek" | "aws" | "base" | "robinhood" | "google" | "alibaba" | "xiaomi"

const collaborations: Array<{
  name: string
  detail: string
  kind: CollaborationKind
  monogram: string
  featured?: boolean
}> = [
  { name: "DeepSeek", detail: "AI development", kind: "deepseek", monogram: "DS" },
  { name: "AWS", detail: "Cloud & AI", kind: "aws", monogram: "AWS" },
  { name: "Base", detail: "Onchain products", kind: "base", monogram: "BASE" },
  { name: "Robinhood Chain", detail: "Onchain products", kind: "robinhood", monogram: "RHC" },
  { name: "Google for Developers", detail: "Developer collaboration", kind: "google", monogram: "GDEV" },
  { name: "Alibaba Cloud", detail: "Cloud & AI", kind: "alibaba", monogram: "ALI" },
  { name: "Xiaomi", detail: "AI development team", kind: "xiaomi", monogram: "MI", featured: true },
]

function CollaborationMark({ kind }: { kind: CollaborationKind }) {
  if (kind === "deepseek") {
    return (
      <Image
        src="/images/deepseek-logo.jpg"
        alt=""
        width={48}
        height={48}
        className="h-10 w-10 rounded-[24%] object-cover"
        aria-hidden="true"
      />
    )
  }

  if (kind === "aws") {
    return (
      <svg viewBox="0 0 52 32" className="h-8 w-11" aria-hidden="true">
        <text x="4" y="20" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="700">
          aws
        </text>
        <path d="M9 24c9 5 21 5 31 0" fill="none" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" />
        <path d="m37 22 4 1-2 4" fill="none" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (kind === "robinhood") return <Feather className="h-8 w-8 text-[#00c805]" aria-hidden="true" />

  if (kind === "google") {
    return (
      <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
        <path d="M13 5 5 16" stroke="#4285f4" strokeWidth="3.2" strokeLinecap="round" />
        <path d="m5 16 8 11" stroke="#ea4335" strokeWidth="3.2" strokeLinecap="round" />
        <path d="m19 5 8 11" stroke="#fbbc04" strokeWidth="3.2" strokeLinecap="round" />
        <path d="m27 16-8 11" stroke="#34a853" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    )
  }

  if (kind === "base") {
    return (
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#0052ff" />
        <path d="M6.5 16h19" stroke="white" strokeWidth="3.2" />
      </svg>
    )
  }

  if (kind === "alibaba") {
    return (
      <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
        <path d="M12 7H6v18h6M20 7h6v18h-6" stroke="#ff6a00" strokeWidth="3" strokeLinecap="round" />
        <path d="M10 16h12" stroke="#ff6a00" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#ff6900" />
      <path
        fill="white"
        d="M6.5 9.5h10.4c3.8 0 5.9 2 5.9 5.8v7.2h-3.9v-6.8c0-1.7-.8-2.4-2.4-2.4h-.6v9.2h-3.6v-9.2h-2v9.2H6.5v-13ZM25 9.5h2.5v13H25z"
      />
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
            <article
              key={group.title}
              className="capability-card group relative overflow-hidden border-b border-r border-border p-6 md:p-8"
            >
              <span
                className="pointer-events-none absolute -right-1 -top-5 font-mono text-[5.5rem] font-semibold tracking-[-0.12em] text-foreground/[0.025] transition duration-500 group-hover:-translate-y-1 group-hover:text-primary/[0.08]"
                aria-hidden="true"
              >
                0{index + 1}
              </span>
              <span className="relative z-10 font-mono text-[0.65rem] text-muted-foreground">0{index + 1}</span>
              <h3 className="relative z-10 mt-8 text-2xl font-semibold uppercase leading-none tracking-[-0.055em] transition-colors group-hover:text-primary md:text-3xl">
                {group.title}
              </h3>
              <p className="relative z-10 mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{group.description}</p>
              <div className="relative z-10 mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                {group.items.map((item) => (
                  <span key={item} className="border-b border-border pb-1 transition-colors group-hover:border-foreground/50">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <div className="grid gap-8 border-y border-border py-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="section-kicker">02B / Collaboration history</p>
              <p className="mt-5 max-w-sm font-mono text-[0.65rem] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
                Selected teams across AI, cloud, developer platforms, and onchain products.
              </p>
            </div>
            <div>
              <h3 className="scroll-type-in display-title text-[clamp(3rem,8vw,6.6rem)]" aria-label="Built with others.">
                <span className="block">Built with</span>
                <span className="display-outline-primary block text-right">others.</span>
              </h3>
              <p className="mt-7 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                This is a record of teams I&apos;ve worked with—not a generic list of tools I happen to use.
              </p>
            </div>
          </div>

          <div className="grid border-l border-t border-border sm:grid-cols-2 xl:grid-cols-4">
            {collaborations.map((collaboration, index) => (
              <article
                key={collaboration.name}
                className={`collaboration-card group relative min-h-48 overflow-hidden border-b border-r border-border bg-background p-5 md:min-h-56 md:p-6 ${
                  collaboration.featured ? "sm:col-span-2" : ""
                }`}
              >
                <span className="collaboration-ghost" aria-hidden="true">
                  {collaboration.monogram}
                </span>
                <div className="relative z-10 flex items-start justify-between">
                  <span className="font-mono text-[0.62rem] text-muted-foreground">[0{index + 1}]</span>
                  <div className="flex h-14 w-14 items-center justify-center border border-border bg-card transition duration-300 group-hover:-rotate-3 group-hover:border-primary group-hover:shadow-[4px_4px_0_hsl(var(--primary))]">
                    <CollaborationMark kind={collaboration.kind} />
                  </div>
                </div>

                <div className="relative z-10 mt-14 md:mt-16">
                  <h4
                    className={`font-semibold leading-[0.95] tracking-[-0.05em] ${
                      collaboration.featured ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"
                    }`}
                  >
                    {collaboration.name}
                  </h4>
                  <p className="mt-3 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-primary">
                    {collaboration.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
