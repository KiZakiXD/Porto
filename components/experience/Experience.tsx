"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Menu,
  Pause,
  Play,
  X,
} from "lucide-react";
import {
  chapters,
  mockLinks,
  networks,
  profile,
  projects,
  type Project,
} from "@/data/folio";
import { contact } from "@/lib/site";
import type { Quality } from "./KineticWorld";

const World = dynamic(() => import("./KineticWorld"), { ssr: false });
const sceneStops = [0, 0.19, 0.38, 0.57, 0.79, 1];
const motionTransition = {
  duration: 0.7,
  ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number],
};

function ChapterLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="chapter-label">
      <span>{index}</span>
      <span className="label-line" />
      <span>{label}</span>
    </div>
  );
}

function ProjectDossier({
  project,
  close,
}: {
  project: Project | null;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState("");
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !project) return;
    const previous = document.activeElement as HTMLElement | null;
    setCopied("");
    dialog.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = before;
      previous?.focus();
    };
  }, [project]);
  const copy = async (kind: "github" | "live") => {
    if (!project) return;
    try {
      await navigator.clipboard.writeText(mockLinks(project.id)[kind]);
      setCopied(kind);
    } catch {
      setCopied("Select and copy the URL below.");
    }
  };
  return (
    <dialog
      ref={ref}
      className="dossier"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      aria-labelledby="dossier-title"
    >
      {project ? (
        <div className="dossier-body">
          <div className="dossier-top">
            <span className="mono">
              PROJECT RECORD /{" "}
              {String(projects.indexOf(project) + 1).padStart(2, "0")}
            </span>
            <button
              className="icon-button"
              aria-label="Close project record"
              onClick={close}
              autoFocus
            >
              <X size={20} />
            </button>
          </div>
          <div className="dossier-network">
            <img
              src="/brands/ethereum.svg"
              alt="Ethereum"
              width="18"
              height="28"
            />
            <span>ETHEREUM / ROBINHOOD</span>
            <span className="record-dot" />
          </div>
          <h2 id="dossier-title">{project.name}</h2>
          <p className="dossier-category">{project.category}</p>
          <p className="dossier-description">{project.description}</p>
          <div className="focus-tags">
            {project.focus.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="record-links">
            <span className="mono">LINK TEMPLATES — PLACEHOLDERS</span>
            <p>
              These destinations are mock URLs, not published project links.
            </p>
            {(["github", "live"] as const).map((kind) => (
              <div className="copy-row" key={kind}>
                <div>
                  <span>
                    {kind === "github" ? "GitHub template" : "Website template"}
                  </span>
                  <code>{mockLinks(project.id)[kind]}</code>
                </div>
                <button
                  aria-label={`Copy ${kind} template`}
                  onClick={() => copy(kind)}
                >
                  {copied === kind ? <Check size={17} /> : <Copy size={17} />}
                </button>
              </div>
            ))}
            <p role="status" className="copy-status">
              {copied === "github" || copied === "live"
                ? "Template copied."
                : copied}
            </p>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

export default function Experience() {
  const story = useRef<HTMLElement>(null),
    progress = useRef(0),
    pointer = useRef<[number, number]>([0, 0]),
    anchors = useRef<number[]>([]),
    chapterTops = useRef<number[]>([]),
    renderRef = useRef<(() => void) | null>(null);
  const [active, setActive] = useState(0),
    [menu, setMenu] = useState(false),
    [network, setNetwork] = useState(0);
  const [exploded, setExploded] = useState(false),
    [quality, setQuality] = useState<Quality>("normal"),
    [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [project, setProject] = useState<Project | null>(null),
    [entered, setEntered] = useState(false);
  const prefersReduced = useReducedMotion();
  const reduce = entered && Boolean(prefersReduced);
  const paused = userPaused ?? Boolean(reduce);
  const { scrollYProgress } = useScroll({
    target: story,
    offset: ["start start", "end end"],
  });
  useEffect(() => setEntered(true), []);
  const updatePosition = useCallback(() => {
    const stops = anchors.current;
    if (stops.length !== chapters.length) return;
    const y = window.scrollY;
    const next = stops.findIndex((stop) => stop > y);
    if (next === -1) progress.current = 1;
    else if (next === 0) progress.current = 0;
    else {
      const index = next - 1;
      const t = Math.max(
        0,
        Math.min(
          1,
          (y - stops[index]) / Math.max(1, stops[next] - stops[index]),
        ),
      );
      progress.current =
        sceneStops[index] + (sceneStops[next] - sceneStops[index]) * t;
    }
    const chapter = Math.max(
      0,
      chapterTops.current.filter((top) => top <= y + window.innerHeight * 0.35)
        .length - 1,
    );
    setActive((old) => (old === chapter ? old : chapter));
    renderRef.current?.();
  }, []);
  useMotionValueEvent(scrollYProgress, "change", updatePosition);
  useEffect(() => {
    const measure = () => {
      const sections = chapters.map(
        (chapter) => document.getElementById(chapter.id)!,
      );
      chapterTops.current = sections.map((section) => section.offsetTop);
      anchors.current = sections.map((section, i) =>
        i === 0
          ? 0
          : section.offsetTop +
            Math.max(0, (section.offsetHeight - window.innerHeight) * 0.5),
      );
      updatePosition();
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (story.current) observer.observe(story.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [updatePosition]);
  useEffect(() => {
    const update = (event: PointerEvent) => {
      if (event.pointerType !== "touch")
        pointer.current = [
          (event.clientX / window.innerWidth) * 2 - 1,
          -((event.clientY / window.innerHeight) * 2 - 1),
        ];
    };
    const leave = () => {
      pointer.current = [0, 0];
    };
    window.addEventListener("pointermove", update, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", update);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  const onReady = useCallback(() => setReady(true), []),
    onFailure = useCallback(() => setFailed(true), []);
  const inspect = (item: Project) => {
    setProject(item);
  };
  const currentNetwork = networks[network];
  return (
    <LazyMotion features={domAnimation} strict>
      <a className="skip-link" href="#work">
        Skip to portfolio
      </a>
      <div
        className={`world-stage ${ready && !failed ? "is-ready" : ""} scene-${active}`}
        aria-hidden="true"
      >
        <div className="stage-grain" />
        <div className="stage-aura" />
        <div className="world-poster">
          <span />
          <span />
          <span />
          <i />
        </div>
        {!failed ? (
          <World
            progress={progress}
            pointer={pointer}
            exploded={exploded}
            paused={paused || active >= 4}
            quality={quality}
            network={network}
            selected={project ? projects.indexOf(project) : 0}
            onReady={onReady}
            onFailure={onFailure}
            renderRef={renderRef}
          />
        ) : null}
      </div>
      <header className="site-header">
        <a className="identity" href="#arrival" onClick={() => setMenu(false)}>
          kizakixd<span>Independent developer</span>
        </a>
        <div className="header-middle">
          <span className="status-dot" /> AVAILABLE FOR SELECT PROJECTS
        </div>
        <button
          className="menu-toggle"
          aria-expanded={menu}
          aria-controls="site-navigation"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          id="site-navigation"
          className={menu ? "site-nav open" : "site-nav"}
          aria-label="Main navigation"
        >
          <a href="#networks" onClick={() => setMenu(false)}>
            Networks
          </a>
          <a href="#work" onClick={() => setMenu(false)}>
            Work <span>11</span>
          </a>
          <a
            className="contact-nav"
            href="#contact"
            onClick={() => setMenu(false)}
          >
            Let’s talk <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>
      <aside className="chapter-rail" aria-label="Experience chapters">
        {chapters.map((chapter, i) => (
          <a
            href={`#${chapter.id}`}
            key={chapter.id}
            className={active === i ? "active" : ""}
            aria-label={chapter.label}
            aria-current={active === i ? "location" : undefined}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <i />
            <em>{chapter.label}</em>
          </a>
        ))}
      </aside>
      <div className="render-controls">
        <span className="render-label">RENDER</span>
        <label className="quality-control">
          <span className="sr-only">Graphics quality</span>
          <select
            aria-label="Graphics quality"
            value={quality}
            onChange={(event) => setQuality(event.target.value as Quality)}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="ultra">Ultra</option>
          </select>
          <ChevronDown size={12} />
        </label>
        <button
          aria-label={paused ? "Resume animation" : "Pause animation"}
          aria-pressed={paused}
          onClick={() => setUserPaused(!paused)}
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
        </button>
      </div>
      <main ref={story} className="story">
        <section id="arrival" className="arrival chapter">
          <div className="arrival-top">
            <ChapterLabel index="01" label="PERSONAL PORTFOLIO / 2026" />
            <span className="edition">ENGINEERED TO EXPLORE</span>
          </div>
          <div className="arrival-title">
            <p className="eyebrow">WEB3 / AI / SYSTEMS</p>
            <h1 aria-label="Beyond the block.">
              <m.span
                className="title-line"
                initial={false}
                animate={{ y: entered || reduce ? 0 : 25 }}
                transition={{ ...motionTransition, duration: reduce ? 0 : 0.7 }}
              >
                Beyond
              </m.span>
              <m.span
                className="outline-line"
                initial={false}
                animate={{ y: entered || reduce ? 0 : 35 }}
                transition={{
                  ...motionTransition,
                  duration: reduce ? 0 : 0.7,
                  delay: reduce ? 0 : 0.12,
                }}
              >
                the block.
              </m.span>
            </h1>
          </div>
          <div className="object-coordinate">
            <span>OBJECT 001</span>
            <span>ORBITAL ASSEMBLY</span>
            <i />
            <span>MOVE YOUR POINTER</span>
          </div>
          <button
            className="assembly-control"
            disabled={failed}
            aria-label={exploded ? "Reassemble" : "Disassemble"}
            aria-pressed={exploded}
            onClick={() => setExploded(!exploded)}
          >
            <span className="crosshair" aria-hidden="true">
              +
            </span>
            <span>{exploded ? "Reassemble" : "Disassemble"}</span>
            <span className="mono" aria-hidden="true">
              {exploded ? "−" : "+"}
            </span>
          </button>
          <div className="arrival-bottom">
            <p>
              Code is the foundation.
              <br />
              The experience is everything.
            </p>
            <a className="scroll-cue" href="#perspective">
              <span>SCROLL TO UNFOLD</span>
              <ArrowDown size={17} />
            </a>
            <span className="arrival-index">[ 001 — 006 ]</span>
          </div>
        </section>
        <section id="perspective" className="perspective chapter">
          <div className="perspective-caption mono">
            EVERY PART HAS A PURPOSE.
            <br />
            SO DOES EVERY LINE OF CODE.
          </div>
          <m.div
            className="chapter-copy right-copy"
            initial={false}
            whileInView={{ y: 0 }}
            transition={motionTransition}
          >
            <ChapterLabel index="02" label="PERSPECTIVE" />
            <h2>
              Independent
              <br />
              mind.
              <br />
              <em>
                Connected
                <br />
                systems.
              </em>
            </h2>
            <p>{profile.introduction}</p>
            <div className="role-lines">
              <span>01 / WEB3 DEVELOPMENT</span>
              <span>02 / BLOCKCHAIN ARCHITECTURE</span>
              <span>03 / AI & TECHNICAL SUPPORT</span>
            </div>
            <a
              className="text-link"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              Explore my GitHub <ArrowUpRight size={17} />
            </a>
          </m.div>
        </section>
        <section
          id="networks"
          className={`networks chapter network-${currentNetwork.id}`}
        >
          <div className="network-copy">
            <ChapterLabel index="03" label="CONNECTED ECOSYSTEMS" />
            <h2>
              Different chains.
              <br />
              <em>One mindset.</em>
            </h2>
            <div
              className="network-tabs"
              role="group"
              aria-label="Choose an ecosystem"
            >
              {networks.map((item, i) => (
                <button
                  key={item.id}
                  aria-pressed={network === i}
                  onClick={() => setNetwork(i)}
                >
                  <img src={item.symbol} alt="" width="22" height="22" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
            <m.div
              className="network-record"
              key={currentNetwork.id}
              initial={reduce ? false : { opacity: 0.4, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="network-logo">
                <img
                  src={currentNetwork.logo}
                  alt={currentNetwork.name}
                  width="160"
                  height="42"
                />
              </div>
              <span className="mono network-label">{currentNetwork.label}</span>
              <div className="network-number">
                {currentNetwork.count}
                <span>{currentNetwork.suffix}</span>
              </div>
              <span className="network-metric">{currentNetwork.metric}</span>
              <p>{currentNetwork.description}</p>
              <a className="text-link" href="#work">
                Explore selected work <ArrowDown size={17} />
              </a>
            </m.div>
          </div>
          <div className="network-orbit-label mono">
            <span>TRANSMISSION / {String(network + 1).padStart(2, "0")}</span>
            <span>CONNECTED, BY DESIGN.</span>
          </div>
          <noscript>
            <div className="static-networks">
              Base: 31+ projects and contributions. Solana: 16 projects
              developed.
            </div>
          </noscript>
        </section>
        <section id="intelligence" className="intelligence chapter">
          <div className="signal-readout mono">
            <span className="status-dot" /> HUMAN INPUT.
            <br />
            MACHINE POSSIBILITIES.
          </div>
          <div className="chapter-copy right-copy">
            <ChapterLabel index="04" label="HUMAN × MACHINE" />
            <div className="collaboration-marks">
              <img
                src="/brands/xiaomi.svg"
                alt="Xiaomi"
                width="46"
                height="46"
              />
              <span>×</span>
              <div className="mimo-mark">
                <img
                  src="/brands/mimo.png"
                  alt="MiMo AI"
                  width="120"
                  height="44"
                />
              </div>
            </div>
            <h2>
              Intelligence
              <br />
              needs
              <br />
              <em>intuition.</em>
            </h2>
            <p>{profile.collaboration.description}</p>
            <div className="collaboration-roles">
              {profile.collaboration.roles.map((role, i) => (
                <div key={role}>
                  <span>0{i + 1}</span>
                  <strong>{role}</strong>
                  <ArrowUpRight size={16} />
                </div>
              ))}
            </div>
            <span className="mono relationship-label">
              {profile.collaboration.relationship} / XIAOMI MIMO AI
            </span>
          </div>
        </section>
        <section id="work" className="work chapter">
          <div className="work-heading">
            <ChapterLabel index="05" label="SELECTED WORK" />
            <h2>
              Built to
              <br />
              <em>do something.</em>
            </h2>
            <p>
              Eight highlighted directions.
              <br />
              Three more worth exploring.
            </p>
          </div>
          <div className="work-registry">
            <div className="registry-heading mono">
              <span>PROJECT / 001—008</span>
              <span>ETHEREUM / ROBINHOOD</span>
            </div>
            {projects
              .filter((item) => item.featured)
              .map((item, i) => (
                <button
                  className="project-row"
                  key={item.id}
                  onClick={() => inspect(item)}
                >
                  <span className="project-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="project-name">
                    {item.name}
                    <small>{item.category}</small>
                  </span>
                  <span className="project-category">{item.category}</span>
                  <ArrowUpRight size={21} />
                </button>
              ))}
            <details className="other-projects">
              <summary>
                <span>Further explorations</span>
                <span className="mono">+ 03</span>
                <ChevronDown size={18} />
              </summary>
              <div>
                {projects
                  .filter((item) => !item.featured)
                  .map((item) => (
                    <button key={item.id} onClick={() => inspect(item)}>
                      <span>
                        {item.name}
                        <small>{item.category}</small>
                      </span>
                      <ArrowUpRight size={18} />
                    </button>
                  ))}
              </div>
            </details>
            <p className="portfolio-note">
              Project destinations are labeled mock templates inside each
              record.
            </p>
          </div>
          <noscript>
            <div className="static-records">
              {projects.map((item) => (
                <article key={item.id}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </noscript>
        </section>
        <section id="contact" className="contact chapter">
          <ChapterLabel index="06" label="NEXT TRANSMISSION" />
          <p className="contact-prelude">
            A difficult problem. An ambitious idea. A new collaboration.
          </p>
          <h2>
            Let’s make
            <br />
            <em>it happen.</em>
          </h2>
          <a
            className="contact-button"
            href={contact.href}
            target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer"
          >
            <span>Start a conversation</span>
            <ArrowUpRight size={26} />
          </a>
          <div className="contact-signoff">
            <span>
              {profile.name}
              <small>WEB3 DEVELOPER / BLOCKCHAIN ARCHITECT</small>
            </span>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={14} />
            </a>
            <a href="#arrival">Back to arrival ↑</a>
          </div>
        </section>
      </main>
      <div className="chapter-readout mono">
        <span>{String(active + 1).padStart(2, "0")}</span> / 06 <i />{" "}
        {chapters[active].label}
      </div>
      {failed ? (
        <div className="fallback-notice" role="status">
          3D unavailable · Portfolio remains accessible
        </div>
      ) : null}
      <ProjectDossier project={project} close={() => setProject(null)} />
    </LazyMotion>
  );
}
