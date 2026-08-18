import Image from "next/image"

const facts = [
  ["Based in", "Kudus, Central Java"],
  ["Current chapter", "Student · building in public"],
  ["Focus", "Web · automation · AI"],
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

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-20">
          <figure>
            <div className="overflow-hidden border border-border bg-card">
              <Image
                src="/images/profile-real.jpeg"
                alt="Aldi Zakia Pratama"
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 45vw, calc(100vw - 2.5rem)"
                className="aspect-[4/3] w-full object-cover grayscale transition duration-500 hover:grayscale-0"
              />
            </div>
            <figcaption className="meta-copy flex items-center justify-between border-b border-border py-3 text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
              <span>Portrait / 2026</span>
              <span>06°48&apos;S · 110°50&apos;E</span>
            </figcaption>
          </figure>

          <div>
            <p className="max-w-3xl text-2xl font-medium leading-[1.2] tracking-[-0.04em] md:text-3xl">
              I learn by making things real—then rebuilding them until every detail earns its place.
            </p>

            <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-muted-foreground md:text-lg">
              <p>
                I&apos;m Aldi Zakia Pratama, also known online as KizakiXD. My interest in programming started in sixth
                grade and kept growing through small experiments, bots, websites, and tools I actually wanted to use.
              </p>
              <p>
                Today I focus on web development, automation, AI integrations, and interfaces that communicate clearly
                without losing their personality.
              </p>
            </div>

            <div className="mt-10 border-t border-border">
              {facts.map(([label, value], index) => (
                <div key={label} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-border py-4 sm:grid-cols-[3rem_0.7fr_1fr]">
                  <span className="font-mono text-[0.65rem] text-muted-foreground">0{index + 1}</span>
                  <span className="section-kicker">{label}</span>
                  <span className="col-start-2 font-medium sm:col-start-3">{value}</span>
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
      </div>
    </section>
  )
}
