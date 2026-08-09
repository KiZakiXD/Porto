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
    description: "Areas I keep learning instead of pretending to have a percentage score for.",
    items: ["Web3", "Blockchain", "UI systems", "Product design"],
  },
]

export default function SkillsSection() {
  return (
    <section id="skills" className="section-shell bg-card py-20 md:py-28">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="section-kicker">02 / Capabilities</p>
            <h2 className="display-title mt-6 text-5xl sm:text-6xl">Tools are secondary. Thinking comes first.</h2>
            <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">
              I removed the old 70–90% proficiency bars. A number rarely explains whether someone can solve the problem
              in front of them; actual work does.
            </p>
          </div>

          <div className="border-t border-border">
            {groups.map((group, index) => (
              <article key={group.title} className="grid gap-5 border-b border-border py-7 sm:grid-cols-[3rem_0.8fr_1.2fr] sm:gap-7">
                <span className="text-xs text-muted-foreground">0{index + 1}</span>
                <div>
                  <h3 className="text-2xl font-medium tracking-[-0.035em]">{group.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p>
                </div>
                <div className="flex flex-wrap content-start gap-2 sm:justify-end">
                  {group.items.map((item) => (
                    <span key={item} className="border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em]">
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
