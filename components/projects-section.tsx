export default function ProjectsSection() {
  return (
    <section id="projects" className="section-shell bg-background/60 py-20 md:py-28">
      <div className="container">
        <div className="border-b border-border pb-10">
          <p className="section-kicker">03 / Selected work</p>
          <h2
            className="scroll-type-in display-title mt-7 max-w-6xl text-[clamp(3.8rem,12.5vw,10rem)]"
            aria-label="Coming soon"
          >
            <span className="block">Coming</span>
            <span className="display-outline block text-right">soon.</span>
          </h2>
        </div>

        <div className="editorial-grid grid gap-10 border-b border-border py-10 md:grid-cols-[1fr_auto] md:items-end md:py-14">
          <div>
            <p className="max-w-2xl text-xl font-medium leading-[1.35] tracking-[-0.035em] md:text-2xl">
              A smaller, sharper collection of work is being prepared.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
              Case studies will appear here when they are ready to be shown properly—not just as a list of repositories.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            In progress / 2026
          </div>
        </div>
      </div>
    </section>
  )
}
