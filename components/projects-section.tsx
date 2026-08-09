import Link from "next/link"
import { ArrowUpRight, Github } from "lucide-react"

const projects = [
  {
    index: "01",
    title: "KizakiXD Portfolio",
    description: "The portfolio you are viewing now, rebuilt around a restrained typography-first visual system.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    year: "2026",
    liveUrl: "https://www.kizakixd.my.id/",
    sourceUrl: null,
  },
  {
    index: "02",
    title: "OpenAI WhatsApp Bot",
    description: "An earlier Node.js WhatsApp bot experiment that connects conversational flows with OpenAI tooling.",
    stack: ["Node.js", "WhatsApp", "OpenAI"],
    year: "Archive",
    liveUrl: null,
    sourceUrl: "https://github.com/KiZakiXD/OpenAi",
  },
  {
    index: "03",
    title: "Chitanda Public",
    description: "A public WhatsApp bot codebase from an earlier stage of my development journey.",
    stack: ["JavaScript", "Node.js", "WhatsApp"],
    year: "Archive",
    liveUrl: null,
    sourceUrl: "https://github.com/KiZakiXD/Chitanda-Public",
  },
  {
    index: "04",
    title: "neoxr-mod",
    description: "A newer public JavaScript repository used for ongoing bot and automation experiments.",
    stack: ["JavaScript", "Automation", "Experiment"],
    year: "2025",
    liveUrl: null,
    sourceUrl: "https://github.com/KiZakiXD/neoxr-mod",
  },
]

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-shell bg-background py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col gap-8 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">03 / Selected work</p>
            <h2 className="display-title mt-6 max-w-4xl text-5xl sm:text-6xl lg:text-7xl">
              Real repositories over <span className="text-primary">placeholder case studies.</span>
            </h2>
          </div>
          <Link
            href="https://github.com/KiZakiXD"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold underline decoration-border underline-offset-8 hover:decoration-foreground"
          >
            GitHub profile <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          {projects.map((project) => (
            <article key={project.title} className="group grid gap-5 border-b border-border py-8 md:grid-cols-[4rem_1fr_0.8fr_auto] md:items-start md:gap-8">
              <span className="text-xs text-muted-foreground">{project.index}</span>
              <div>
                <h3 className="text-3xl font-medium tracking-[-0.045em] transition-colors group-hover:text-primary md:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {project.stack.map((item) => <span key={item}>{item}</span>)}
              </div>
              <div className="flex items-center gap-4 md:justify-end">
                <span className="text-xs text-muted-foreground">{project.year}</span>
                {project.liveUrl && (
                  <Link href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`} className="grid h-10 w-10 place-items-center border border-border hover:border-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
                {project.sourceUrl && (
                  <Link href={project.sourceUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} source`} className="grid h-10 w-10 place-items-center border border-border hover:border-foreground">
                    <Github className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
