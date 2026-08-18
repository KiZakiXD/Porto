import Link from "next/link"
import { ArrowUpRight, Github } from "lucide-react"

const projects = [
  {
    index: "01",
    title: "KizakiXD Portfolio",
    description: "The portfolio you are viewing now, rebuilt around a distinctive typography-first visual system.",
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
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="section-kicker">03 / Selected work</p>
            <h2 className="display-title mt-7 max-w-5xl text-[clamp(3.6rem,8.5vw,8rem)]">
              <span className="block">Real work.</span>
              <span className="display-outline block">No filler.</span>
            </h2>
          </div>
          <Link
            href="https://github.com/KiZakiXD"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 border-b border-border pb-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] transition-colors hover:border-foreground"
          >
            GitHub profile
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div>
          {projects.map((project) => (
            <article
              key={project.title}
              className="group grid gap-5 border-b border-border py-8 md:grid-cols-[4rem_1fr_0.8fr_auto] md:items-start md:gap-8"
            >
              <span className="font-mono text-[0.65rem] text-muted-foreground">[{project.index}]</span>
              <div>
                <h3 className="text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.06em] transition-colors group-hover:text-primary md:text-5xl">
                  {project.title}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 md:justify-end">
                <span className="font-mono text-[0.65rem] text-muted-foreground">{project.year}</span>
                {project.liveUrl ? (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title}`}
                    className="grid h-10 w-10 place-items-center border border-border transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : null}
                {project.sourceUrl ? (
                  <Link
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${project.title} source`}
                    className="grid h-10 w-10 place-items-center border border-border transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <Github className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
