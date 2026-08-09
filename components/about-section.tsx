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
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="section-kicker">01 / Profile</p>
            <div className="mt-7 overflow-hidden border border-border bg-card">
              <Image
                src="/images/profile-real.jpeg"
                alt="Aldi Zakia Pratama"
                width={900}
                height={900}
                className="aspect-square w-full object-cover grayscale transition duration-500 hover:grayscale-0"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="display-title text-balance text-5xl sm:text-6xl lg:text-7xl">
                Curious by default. <span className="text-primary">Practical by choice.</span>
              </h2>

              <div className="mt-10 max-w-3xl space-y-5 text-base leading-8 text-muted-foreground md:text-lg">
                <p>
                  I&apos;m Aldi Zakia Pratama, also known online as KizakiXD. My interest in programming started in sixth
                  grade and kept growing through small experiments, bots, websites, and tools I actually wanted to use.
                </p>
                <p>
                  I&apos;m currently a student at SMK WISUDA KARYA. Instead of trying to look like an expert at everything,
                  I prefer learning by shipping: build something, break it, understand why, then make the next version
                  cleaner.
                </p>
                <p>
                  Most of my attention today goes to web development, automation, AI integrations, and interfaces that
                  communicate clearly without unnecessary visual effects.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <div className="grid border-y border-border sm:grid-cols-3">
                {facts.map(([label, value], index) => (
                  <div key={label} className="border-b border-border py-5 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">0{index + 1} · {label}</p>
                    <p className="mt-2 font-heading text-lg font-medium">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                {interests.map((item) => (
                  <span key={item} className="border-b border-border pb-1">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
