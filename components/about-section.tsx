import Image from "next/image"

const facts = [
  ["Current chapter", "AI · security · onchain"],
  ["Collaboration", "Small teams · rapid iteration"],
  ["Approach", "Learn · test · ship"],
]

export default function AboutSection() {
  return (
    <section id="about" className="section-shell bg-background/60 py-20 md:py-28">
      <div className="container">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          <p className="section-kicker pt-2">01 / Profile</p>
          <h2 className="scroll-type-in display-title max-w-6xl text-[clamp(3.6rem,9.5vw,8.5rem)]">
            <span className="block">Curious</span>
            <span className="display-outline block">by default.</span>
            <span className="display-italic block text-right text-primary">Practical.</span>
          </h2>
        </div>

        <div className="mt-10 border-b border-border pb-12 lg:pb-16">
          <div className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] items-stretch gap-5 border-b border-border pb-10 sm:gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-16">
            <figure className="self-start">
              <div className="relative overflow-hidden border border-border bg-card">
                <Image
                  src="/images/profile-real.jpeg"
                  alt="Aldi Zakia Pratama"
                  width={960}
                  height={1200}
                  sizes="(min-width: 1024px) 19rem, 35vw"
                  className="aspect-[4/5] w-full object-cover object-[58%_50%] grayscale transition duration-500 hover:grayscale-0"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/80 to-transparent" aria-hidden="true" />
                <span className="absolute left-2 top-2 bg-background px-2 py-1 font-mono text-[0.58rem] font-semibold text-foreground">
                  01 / PORTRAIT
                </span>
                <span className="absolute inset-y-0 right-0 w-1 bg-primary" aria-hidden="true" />
              </div>
              <figcaption className="meta-copy flex items-center justify-between border-b border-border py-2.5 text-[0.55rem] uppercase tracking-[0.12em] text-muted-foreground md:text-[0.62rem]">
                <span>Profile</span>
                <span>2026</span>
              </figcaption>
            </figure>

            <div className="flex min-w-0 flex-col justify-between py-1 lg:py-3">
              <div>
                <p className="section-kicker">Aldi Zakia Pratama</p>
                <p className="mt-4 max-w-4xl text-[clamp(1.25rem,4.8vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.045em]">
                  I work where <span className="text-primary">AI, security,</span> and onchain products overlap.
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-4">
                <p className="meta-copy text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Now / Building with small teams
                </p>
                <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground md:text-sm md:leading-6">
                  Learning fast, testing real systems, and turning useful ideas into working software.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <p className="max-w-3xl text-2xl font-medium leading-[1.2] tracking-[-0.04em] md:text-3xl">
              I learn by testing ideas against real systems—then turning what works into useful products.
            </p>

            <div className="max-w-3xl space-y-5 text-base leading-8 text-muted-foreground md:text-lg">
              <p>
                I&apos;m Aldi Zakia Pratama, also known online as KizakiXD. My interest in programming started in sixth
                grade and kept growing through small experiments, bots, websites, and tools I actually wanted to use.
              </p>
              <p>
                Today I focus on AI development and automation, cybersecurity and responsible bug bounty work, plus
                onchain tooling for token and memecoin communities.
              </p>
              <p>
                I collaborate with small teams exploring products across Base and Robinhood Chain while
                continuing to sharpen the web engineering behind them.
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
        </div>
      </div>
    </section>
  )
}
