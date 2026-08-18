const groups = [
  {
    title: "Frontend",
    description: "Interfaces that stay readable, responsive, and maintainable.",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend & tooling",
    description: "Practical services, APIs, scripts, and development workflows.",
    items: ["Node.js", "REST APIs", "Git", "Vercel"],
  },
  {
    title: "Automation & AI",
    description: "Experiments that reduce repetitive work or add useful intelligence.",
    items: ["AI APIs", "Bots", "Automation", "Prompt workflows"],
  },
  {
    title: "Exploring",
    description: "Areas I keep learning through experiments and real output.",
    items: ["Web3", "Blockchain", "UI systems", "Product design"],
  },
]

export default function SkillsSection() {
  return (
    <section id="skills" className="section-shell bg-card py-20 md:py-28">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <p className="section-kicker">02 / Capabilities</p>
            <h2 className="display-title mt-7 text-[clamp(3.5rem,7.5vw,7rem)]">
              <span className="block">Tools are</span>
              <span className="display-outline block">secondary.</span>
              <span className="display-italic block text-primary">Thinking first.</span>
            </h2>
            <p className="mt-8 max-w-md text-base leading-7 text-muted-foreground">
              The stack changes. The job stays the same: understand the problem, remove friction, and ship something
              useful.
            </p>
          </div>

          <div className="border-t border-border">
            {groups.map((group, index) => (
              <article
                key={group.title}
                className="group grid gap-5 border-b border-border py-7 sm:grid-cols-[3rem_0.9fr_1.1fr] sm:gap-7"
              >
                <span className="font-mono text-[0.65rem] text-muted-foreground">0{index + 1}</span>
                <div>
                  <h3 className="text-2xl font-semibold uppercase leading-none tracking-[-0.055em] transition-colors group-hover:text-primary md:text-3xl">
                    {group.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{group.description}</p>
                </div>
                <div className="flex flex-wrap content-start gap-2 sm:justify-end">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="border border-border px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition-colors group-hover:border-foreground/40"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
