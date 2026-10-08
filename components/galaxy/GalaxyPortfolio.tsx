"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Github,
  Menu,
  MousePointer2,
  Pause,
  Play,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  portfolio,
  projects,
  type Project,
  type ProjectCategory,
} from "@/data/portfolio";
import { contact } from "@/lib/site";
import { EthereumMark, NetworkMark, ProjectMark, StarMark } from "./Marks";
import type { World } from "./SpaceScene";

const SpaceScene = dynamic(() => import("./SpaceScene"), { ssr: false });
const featured = projects.filter((project) => project.featured);
const others = projects.filter((project) => !project.featured);
const filters: Array<"All projects" | ProjectCategory> = [
  "All projects",
  "Security",
  "DeFi",
  "Infrastructure",
  "RWA",
  "Payments",
];

class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Count({
  value,
  suffix,
  reducedMotion,
}: {
  value: number;
  suffix: string;
  reducedMotion: boolean;
}) {
  const [count, setCount] = useState(value);
  const node = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reducedMotion || !node.current) {
      setCount(value);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / 1500, 1);
          setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.8 },
    );
    observer.observe(node.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, reducedMotion]);
  return (
    <span
      ref={node}
      className="ecosystem-number"
      aria-label={`${value}${suffix}`}
    >
      <span aria-hidden="true">
        {count}
        <sup>{suffix}</sup>
      </span>
    </span>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const copy = async (key: "github" | "live") => {
    try {
      await navigator.clipboard.writeText(project.mockLinks[key]);
      setCopied(key);
    } catch {
      setCopied("Select the URL to copy it.");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(""), 2200);
  };
  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      style={{ "--project-color": project.accent } as CSSProperties}
    >
      <div className="dialog-layout">
        <div
          className={`dialog-art project-art art-${project.symbol}`}
          aria-hidden="true"
        >
          <div className="artifact-ring" />
          <div className="art-body">
            <ProjectMark symbol={project.symbol} size={76} />
          </div>
          <span className="art-caption">
            {project.category.toUpperCase()} / ETHEREUM · ROBINHOOD
          </span>
        </div>
        <div className="dialog-copy">
          <button
            className="icon-button dialog-close"
            onClick={onClose}
            aria-label="Close project details"
            autoFocus
          >
            <X size={22} />
          </button>
          <p className="eyebrow">PROJECT DOSSIER / {project.category}</p>
          <h2 id="project-dialog-title">{project.name}</h2>
          <p className="dialog-line">{project.line}</p>
          <p className="dialog-description">{project.description}</p>
          <div className="focus-tags">
            {project.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="dialog-link-status">
            <span>
              <Github size={15} /> GitHub <small>PLACEHOLDER</small>
            </span>
            <span>
              <ArrowUpRight size={15} /> Live website <small>PLACEHOLDER</small>
            </span>
          </div>
          <details className="link-templates">
            <summary>
              Preview link templates
              <ChevronDown size={14} />
            </summary>
            <p>These are mock addresses for this preview.</p>
            {(["github", "live"] as const).map((key) => (
              <div key={key}>
                <code>{project.mockLinks[key]}</code>
                <button
                  onClick={() => copy(key)}
                  aria-label={`Copy ${key === "github" ? "GitHub" : "website"} placeholder`}
                >
                  {copied === key ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            ))}
            <span className="sr-only" aria-live="polite">
              {copied === "github" || copied === "live"
                ? "Placeholder copied."
                : copied}
            </span>
          </details>
        </div>
      </div>
    </dialog>
  );
}

export default function GalaxyPortfolio() {
  const [world, setWorld] = useState<World>("mars");
  const [motionOff, setMotionOff] = useState(false);
  const [lowDetail, setLowDetail] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [engine, setEngine] = useState<
    "checking" | "available" | "unavailable"
  >("checking");
  const [sceneReady, setSceneReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All projects");
  const [selected, setSelected] = useState<Project | null>(null);
  const hero = useRef<HTMLElement>(null),
    menuButton = useRef<HTMLButtonElement>(null);
  const visibleProjects =
    filter === "All projects"
      ? featured
      : featured.filter((project) => project.category === filter);
  const onReady = useCallback(() => setSceneReady(true), []);
  const onError = useCallback(() => {
    setEngine("unavailable");
    setSceneReady(false);
    setInteractive(false);
  }, []);
  const onClose = useCallback(() => setSelected(null), []);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    setMotionOff(preference.matches);
    const sync = (event: MediaQueryListEvent) => setMotionOff(event.matches);
    preference.addEventListener("change", sync);
    setLowDetail((navigator.hardwareConcurrency || 8) <= 4);
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      if (gl) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        setEngine("available");
      } else setEngine("unavailable");
    } catch {
      setEngine("unavailable");
    }
    const hidden = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", hidden);
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { rootMargin: "100px" },
    );
    if (hero.current) observer.observe(hero.current);
    return () => {
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", hidden);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <div className="galaxy-page" data-motion={motionOff ? "off" : "on"}>
      <a href="#work" className="skip-link">
        Skip to selected work
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="KIZAKIXD home">
          <StarMark />
          <span>
            {portfolio.name}
            <small>DEVELOPER & ARCHITECT</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#collaboration">Collaboration</a>
          <a href="#work">Selected work</a>
          <a href="#ecosystems">Ecosystems</a>
        </nav>
        <a className="header-contact" href="#contact">
          Let’s talk <ArrowUpRight size={16} />
        </a>
        <button
          className="icon-button mobile-menu-toggle"
          ref={menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        {menuOpen && (
          <nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
          >
            {[
              ["collaboration", "Collaboration"],
              ["work", "Selected work"],
              ["ecosystems", "Ecosystems"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section
          className={`hero ${interactive ? "is-interactive" : ""}`}
          id="top"
          ref={hero}
          aria-labelledby="hero-heading"
        >
          <div className="hero-nebula" aria-hidden="true" />
          <div
            className={`static-cosmos ${sceneReady ? "is-hidden" : ""}`}
            aria-hidden="true"
          >
            <div className={`static-planet planet-${world}`} />
            <div className="static-moon" />
          </div>
          <div
            className="space-canvas"
            data-ready={sceneReady}
            style={{ pointerEvents: interactive ? "auto" : "none" }}
          >
            {engine === "available" && (
              <SceneBoundary onError={onError}>
                <SpaceScene
                  world={world}
                  paused={
                    motionOff || !visible || !tabVisible || Boolean(selected)
                  }
                  lowDetail={lowDetail}
                  interactive={interactive}
                  onReady={onReady}
                  onError={onError}
                />
              </SceneBoundary>
            )}
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content">
            <div className="availability">
              <span />
              OPEN TO EXTRAORDINARY IDEAS
            </div>
            <h1 id="hero-heading">
              Engineering
              <br />
              <span>new worlds.</span>
            </h1>
            <p className="hero-introduction">{portfolio.introduction}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#work">
                Explore my work
                <ArrowDownRight size={21} />
              </a>
              <a className="text-button" href="#collaboration">
                Meet the developer
                <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="hero-disciplines">
              <span>WEB3 DEVELOPMENT</span>
              <i />
              <span>BLOCKCHAIN ARCHITECTURE</span>
              <i />
              <span>AI & SUPPORT</span>
            </div>
          </div>
          <div className="planet-label">
            <span className="planet-coordinate">
              {world === "mars" ? "04" : "05"} / SOLAR SYSTEM
            </span>
            <strong>
              {world === "mars" ? "Mars" : "Jupiter"}
              <span>↗</span>
            </strong>
            <p>
              {world === "mars"
                ? "A little further from ordinary."
                : "Think on a different scale."}
            </p>
          </div>
          <div className="hero-bottom">
            <a className="scroll-cue" href="#collaboration">
              <span className="scroll-line" />
              <span>SCROLL TO DISCOVER</span>
              <ArrowDown size={14} />
            </a>
            <div className="scene-controls">
              <div className="planet-switch" aria-label="Featured planet">
                <button
                  aria-pressed={world === "mars"}
                  onClick={() => setWorld("mars")}
                >
                  01 <span>Mars</span>
                </button>
                <button
                  aria-pressed={world === "jupiter"}
                  onClick={() => setWorld("jupiter")}
                >
                  02 <span>Jupiter</span>
                </button>
              </div>
              <button
                className={`scene-interact ${interactive ? "is-active" : ""}`}
                onClick={() => setInteractive(!interactive)}
                disabled={!sceneReady}
                aria-pressed={interactive}
              >
                <MousePointer2 size={14} />
                {engine === "unavailable"
                  ? "Static view"
                  : interactive
                    ? "Finish exploring"
                    : "Drag to explore"}
              </button>
              <button
                className="icon-button scene-setting"
                onClick={() => setMotionOff(!motionOff)}
                aria-label={motionOff ? "Resume animation" : "Pause animation"}
                aria-pressed={motionOff}
              >
                {motionOff ? <Play size={15} /> : <Pause size={15} />}
              </button>
              <button
                className="icon-button scene-setting"
                onClick={() => setLowDetail(!lowDetail)}
                aria-label="Low detail mode"
                aria-pressed={lowDetail}
              >
                <SlidersHorizontal size={15} />
              </button>
            </div>
          </div>
        </section>

        <section
          className="ecosystem-strip container"
          aria-label="Ecosystems and technologies"
        >
          <p className="eyebrow">
            BUILDING ACROSS
            <br />
            CONNECTED WORLDS
          </p>
          <div>
            <EthereumMark />
            <span>Ethereum</span>
          </div>
          <div className="robinhood-word">
            Robinhood<span className="tiny-star">✦</span>
          </div>
          <div>
            <NetworkMark network="base" />
            <span>Base</span>
          </div>
          <div>
            <NetworkMark network="solana" />
            <span>Solana</span>
          </div>
          <div className="xiaomi-word">
            Xiaomi <span>×</span> MiMo
          </div>
        </section>

        <section
          className="collaboration-section container section-space"
          id="collaboration"
          aria-labelledby="collaboration-heading"
        >
          <div className="section-kicker">
            <span className="eyebrow">01 / THE INTELLIGENCE CONNECTION</span>
            <span className="section-rule" />
          </div>
          <div className="collaboration-grid">
            <div className="collaboration-copy">
              <div className="partner-tag">
                <span className="mi-mark">mi</span>
                <span>
                  Xiaomi <span className="muted">/</span> MiMo AI
                </span>
                <small>KEY PARTNERSHIP</small>
              </div>
              <h2 id="collaboration-heading">
                Human intuition.
                <br />
                <span>Machine potential.</span>
              </h2>
              <p>{portfolio.collaboration.description}</p>
              <div className="role-pills">
                {portfolio.collaboration.roles.map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
              <a className="text-button" href="#expertise">
                Where I contribute
                <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="intelligence-art" aria-hidden="true">
              <div className="ai-grid" />
              <span className="art-corner top-left">
                MIMO / INTELLIGENCE CORE
              </span>
              <span className="art-corner top-right">∞</span>
              <div className="ai-ring ai-ring-one" />
              <div className="ai-ring ai-ring-two" />
              <div className="ai-core">
                <span className="ai-core-glint" />
                <StarMark size={92} />
              </div>
              <div className="ai-node node-one" />
              <div className="ai-node node-two" />
              <div className="ai-node node-three" />
              <div className="ai-art-bottom">
                <span className="live-dot" />
                <span>HUMAN INPUT. GREATER POSSIBILITIES.</span>
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        </section>

        <section
          className="work-section container section-space"
          id="work"
          aria-labelledby="work-heading"
        >
          <div className="section-kicker">
            <span className="eyebrow">02 / SELECTED WORK</span>
            <span className="section-rule" />
            <span className="eyebrow faint">ENGINEERED WITH INTENT</span>
          </div>
          <div className="section-heading-row">
            <h2 id="work-heading">
              Ideas with
              <br />
              <span>onchain gravity.</span>
            </h2>
            <div className="work-intro">
              <span className="network-label">
                <EthereumMark />
                ETHEREUM / ROBINHOOD
              </span>
              <p>
                Security, infrastructure, and everyday utility.
                <br />A collection of systems built to move things forward.
              </p>
            </div>
          </div>
          <div className="work-toolbar">
            <div
              className="project-filters"
              role="group"
              aria-label="Filter projects"
            >
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                >
                  {item}
                  {item === "All projects" && <span>08</span>}
                </button>
              ))}
            </div>
            <span className="eyebrow result-count" aria-live="polite">
              {String(visibleProjects.length).padStart(2, "0")} RECORDS
            </span>
          </div>
          <div className="project-grid">
            {visibleProjects.map((project) => (
              <button
                className="project-card"
                key={project.id}
                onClick={() => setSelected(project)}
                aria-label={`View ${project.name}`}
                style={{ "--project-color": project.accent } as CSSProperties}
              >
                <div className="project-card-copy">
                  <span className="project-category">
                    <span className="project-number">
                      {String(featured.indexOf(project) + 1).padStart(2, "0")}
                    </span>
                    {project.category.toUpperCase()}
                  </span>
                  <h3>{project.name}</h3>
                  <p>{project.line}</p>
                  <span className="project-card-link">
                    Explore project
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <div
                  className={`project-art art-${project.symbol}`}
                  aria-hidden="true"
                >
                  <div className="artifact-ring" />
                  <div className="art-body">
                    <ProjectMark symbol={project.symbol} size={49} />
                  </div>
                </div>
              </button>
            ))}
          </div>
          <details className="other-projects">
            <summary>
              <span>
                <span className="eyebrow">BEYOND THE HIGHLIGHTS</span>
                <strong>Three more worlds to explore.</strong>
              </span>
              <span className="others-count">
                + 03 <ChevronDown size={20} />
              </span>
            </summary>
            <div className="other-project-list">
              {others.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelected(project)}
                  style={{ "--project-color": project.accent } as CSSProperties}
                >
                  <span className="other-project-icon">
                    <ProjectMark symbol={project.symbol} size={22} />
                  </span>
                  <span>
                    <strong>{project.name}</strong>
                    <small>{project.line}</small>
                  </span>
                  <span className="other-category">{project.category}</span>
                  <ArrowUpRight size={19} />
                </button>
              ))}
            </div>
          </details>
          <p className="project-note">
            Project destinations are shown as link placeholders in this preview.
          </p>
        </section>

        <section
          className="ecosystems-section container section-space"
          id="ecosystems"
          aria-labelledby="ecosystems-heading"
        >
          <div className="section-kicker">
            <span className="eyebrow">03 / THE BIGGER PICTURE</span>
            <span className="section-rule" />
          </div>
          <div className="section-heading-row">
            <h2 id="ecosystems-heading">
              Different chains.
              <br />
              <span>One drive to build.</span>
            </h2>
            <p className="section-description">
              From Ethereum’s expanding ecosystem to Solana’s speed.
              <br />
              Every network is a new set of possibilities.
            </p>
          </div>
          <div className="ecosystem-cards">
            {portfolio.ecosystems.map((ecosystem) => (
              <article
                className={`ecosystem-card ecosystem-${ecosystem.id}`}
                key={ecosystem.id}
              >
                <div className="ecosystem-card-top">
                  <span className="network-wordmark">
                    <NetworkMark network={ecosystem.id} />
                    {ecosystem.name}
                  </span>
                  <ArrowUpRight size={22} />
                </div>
                <div className="stat-world" aria-hidden="true">
                  <div />
                </div>
                <div className="ecosystem-stat">
                  <Count
                    value={ecosystem.count}
                    suffix={ecosystem.suffix}
                    reducedMotion={motionOff}
                  />
                  <span className="eyebrow">{ecosystem.label}</span>
                </div>
                <p>{ecosystem.description}</p>
                <div className="ecosystem-card-line">
                  <span />
                  {ecosystem.id === "base"
                    ? "ETHEREUM LAYER 2"
                    : "HIGH THROUGHPUT. LOW LATENCY."}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="expertise-section container section-space"
          id="expertise"
          aria-labelledby="expertise-heading"
        >
          <div>
            <p className="eyebrow">04 / HOW I THINK</p>
            <h2 id="expertise-heading">
              Beyond the code.
              <br />
              <span>Into the details.</span>
            </h2>
            <p className="expertise-intro">
              A builder’s mindset.
              <br />
              An architect’s perspective.
              <br />A support team’s commitment.
            </p>
          </div>
          <div className="capability-list">
            {portfolio.capabilities.map((capability) => (
              <article key={capability.number}>
                <span className="capability-number">{capability.number}</span>
                <div>
                  <p className="eyebrow">{capability.tag}</p>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </div>
                <ArrowUpRight size={18} />
              </article>
            ))}
          </div>
        </section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <div className="contact-orbit" aria-hidden="true" />
          <div className="container contact-content">
            <p className="eyebrow">
              <span className="live-dot" />
              THE NEXT CHAPTER STARTS WITH A CONVERSATION
            </p>
            <h2 id="contact-heading">
              Have a world
              <br />
              <span>in mind?</span>
              <StarMark size={58} />
            </h2>
            <div className="contact-bottom">
              <p>
                Let’s turn a bold idea into something
                <br />
                people can actually use.
              </p>
              <a
                className="primary-button"
                href={contact.href}
                target={
                  contact.href.startsWith("https:") ? "_blank" : undefined
                }
                rel={
                  contact.href.startsWith("https:")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                Start a conversation
                <ArrowUpRight size={22} />
                <small>{contact.label}</small>
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <a className="footer-brand" href="#top">
          <StarMark size={19} />
          {portfolio.name}
        </a>
        <span>WEB3 DEVELOPER. BLOCKCHAIN ARCHITECT. HUMAN.</span>
        <div>
          <a href={portfolio.github} target="_blank" rel="noopener noreferrer">
            GitHub
            <ArrowUpRight size={13} />
          </a>
          <a href="#top" aria-label="Back to top">
            Back to top
            <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
      {selected && <ProjectDialog project={selected} onClose={onClose} />}
    </div>
  );
}
