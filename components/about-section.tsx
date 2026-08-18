import Image from "next/image"

const facts = [
  ["Current chapter", "Student · building in public"],
  ["Focus", "Web · automation · AI"],
  ["Approach", "Learn · ship · refine"],
]

const interests = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "Web3",
  "AI integrations",
  "UI structure",
]

export default function AboutSection() {
  return (
    <section id="about" className="section-shell bg-background py-20 md:py-28">
      <div className="container">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <p className="section-kicker pt-2">01 / Profile</p>
          <h2 className="display-title max-w-6xl text-[clamp(3.6rem,9.5vw,8.5rem)]">
            <span className="block">Curious</span>
            <span className="display-outline block">by default.</span>
            <span className="display-italic block text-right text-primary">Practical.</span>
          </h2>
        </div>

        <div className="mt-10 border-b border-border pb-12 lg:pb-16">
          <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-4 md:gap-8 lg:grid-cols-[minmax(17rem,0.62fr)_minmax(0,1.38fr)] lg:gap-16">
            <figure className="max-w-[22rem]">
              <div className="relative bg-card">
                <div className="absolute -left-2 -top-2 h-12 w-12 border-l border-t border-primary" aria-hidden="true" />
                <div className="overflow-hidden border border-border">
                  <Image
                    src="/images/profile-real.jpeg"
                    alt="Aldi Zakia Pratama"
                    width={900}
                    height={1200}
                    sizes="(min-width: 1024px) 22rem, 40vw"
                    className="aspect-[3/4] w-full object-cover object-[58%_50%] grayscale transition duration-500 hover:grayscale-0"
                  />
                </div>
                <span className="absolute left-2 top-2 bg-background px-2 py-1 font-mono text-[0.58rem] font-semibold text-foreground">
                  01
                </span>
                <span className="absolute inset-x-0 bottom-0 h-1 bg-primary" aria-hidden="true" />
              </div>
              <figcaption className="meta-copy flex items-center justify-between border-b border-border py-2.5 text-[0.55rem] uppercase tracking-[0.12em] text-muted-foreground md:text-[0.62rem]">
                <span>Portrait</span>
                <span>2026</span>
              </figcaption>
            </figure>

            <div className="flex min-w-0 flex-col justify-between border-y border-border py-3 md:py-5">
              <div>
                <p className="section-kicker">Profile / 01</p>
                <h3 className="mt-4 text-[clamp(1.55rem,7vw,4.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.065em]">
                  Aldi Zakia
                  <span className="block text-primary">Pratama.</span>
                </h3>
                <p className="mt-4 max-w-xl text-[0.72rem] leading-5 text-muted-foreground sm:text-sm sm:leading-6 md:text-base">
                  Developer exploring web interfaces, practical automation, and useful AI.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 border-t border-border">
                <div className="py-3 pr-2 md:py-4">
                  <span className="section-kicker text-[0.52rem] md:text-[0.62rem]">Focus</span>
                  <span className="mt-1.5 block text-[0.68rem] font-medium sm:text-xs md:text-sm">Web + AI</span>
                </div>
                <div className="border-l border-border py-3 pl-3 md:py-4 md:pl-5">
                  <span className="section-kicker text-[0.52rem] md:text-[0.62rem]">Status</span>
                  <span className="mt-1.5 flex items-center gap-2 text-[0.68rem] font-medium sm:text-xs md:text-sm">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> Building
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <p className="max-w-3xl text-2xl font-medium leading-[1.2] tracking-[-0.04em] md:text-3xl">
              I learn by making things real—then rebuilding them until every detail earns its place.
            </p>

            <div className="max-w-3xl space-y-5 text-base leading-8 text-muted-foreground md:text-lg">
              <p>
                I&apos;m Aldi Zakia Pratama, also known online as KizakiXD. My interest in programming started in sixth
                grade and kept growing through small experiments, bots, websites, and tools I actually wanted to use.
              </p>
              <p>
                Today I focus on web development, automation, AI integrations, and interfaces that communicate clearly
                without losing their personality.
              </p>
            </div>
          </div>

          <div className="mt-10 grid border-t border-border sm:grid-cols-3">
            {facts.map(([label, value], index) => (
              <div
                key={label}
                className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-border py-4 sm:block sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
              >
                <span className="font-mono text-[0.65rem] text-muted-foreground">0{index + 1}</span>
                <div>
                  <span className="section-kicker block sm:mt-3">{label}</span>
                  <span className="mt-1.5 block font-medium">{value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground">
            {interests.map((item) => (
              <span key={item} className="border-b border-border pb-1">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
