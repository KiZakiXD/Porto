'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { relationships } from '@/data/relationships'
import { systems } from '@/data/orbit'
import BrandGlyph, { OrbitMonogram } from './BrandGlyph'
import { OrbitProjectLinks } from './OrbitDrawer'

export default function OrbitQuickView({ onExplore }: { onExplore?: () => void } = {}) {
  return <div className="orbit-quick-page">
    <a className="orbit-skip-link" href="#orbit-quick-content">Skip to portfolio</a>
    <header className="orbit-quick-header"><a className="orbit-wordmark" href="/" aria-label="KIZAKIXD home"><OrbitMonogram /><span>{profile.handle.toLowerCase()}<span className="orbit-wordmark-period">.</span></span></a><span className="orbit-eyebrow orbit-quick-mode">QUICK VIEW</span>{onExplore ? <button className="orbit-outline-link" onClick={onExplore}>Explore the world<ArrowUpRight size={16} /></button> : <a className="orbit-outline-link" href="/">Explore the world<ArrowUpRight size={16} /></a>}</header>
    <main className="orbit-quick-main" id="orbit-quick-content" tabIndex={-1}>
      <section className="orbit-quick-hero"><div><p className="orbit-eyebrow">{profile.name} / {profile.location}</p><h1>Selected work.<br /><span>Open possibilities.</span></h1></div><div><p>{profile.bio}</p><a className="orbit-link" href="#orbit-quick-contact">Start a conversation<ArrowUpRight size={16} /></a></div></section>
      <nav className="orbit-quick-nav" aria-label="Portfolio systems">{systems.map(item => <a href={`#orbit-${item.id}`} key={item.id}><span>{item.number}</span>{item.id === 'mimo' ? 'Intelligence' : item.name}<ArrowUpRight size={13} /></a>)}</nav>
      {systems.map(item => <section className="orbit-quick-system" key={item.id} id={`orbit-${item.id}`} aria-labelledby={`orbit-${item.id}-heading`}><div className="orbit-quick-system-heading"><div className="orbit-quick-system-name"><BrandGlyph system={item.id} paired /><div><p className="orbit-eyebrow">{item.family}</p><h2 id={`orbit-${item.id}-heading`}>{item.id === 'mimo' ? 'Xiaomi / MiMo' : item.name}</h2></div></div><p>{item.subtitle}</p></div><div className="orbit-quick-projects">{projects.filter(project => project.system === item.id).map((project, index) => <article className="orbit-quick-project" key={project.id} id={`work-${project.id}`}><span className="orbit-quick-project-number">{String(index + 1).padStart(2, '0')}</span><div className="orbit-quick-project-body"><div className="orbit-quick-project-title"><h3>{project.title}</h3><span className={`orbit-badge ${project.kind === 'concept' ? 'orbit-badge-concept' : ''}`}>{project.kind === 'concept' ? 'CONCEPT' : 'DEVELOPMENT'}</span></div><p>{project.summary}</p><div className="orbit-quick-project-meta">{project.relationship && <span>{project.relationship}</span>}{project.date && <span>{project.date.label}: {project.date.value}</span>}</div></div><OrbitProjectLinks project={project} /></article>)}</div>{item.id === 'mimo' && <div className="orbit-quick-relations">{relationships.filter(record => record.zone === 'ai-lab').map(record => <article key={record.id}><div><h3>{record.name}</h3><span className="orbit-badge">{record.type}</span></div><p>{record.summary}</p></article>)}</div>}</section>)}
      <section className="orbit-quick-context" aria-labelledby="orbit-context-title"><div><p className="orbit-eyebrow">THE CONNECTIONS</p><h2 id="orbit-context-title">Context matters.</h2></div><div>{relationships.filter(item => item.zone === 'onchain').map(item => <article key={item.id}><div><h3>{item.name}</h3><span className="orbit-badge">{item.type}</span></div><p>{item.summary}</p></article>)}</div></section>
      <section className="orbit-quick-contact" id="orbit-quick-contact"><div><p className="orbit-eyebrow">OPEN A CHANNEL</p><h2>What shall we<br /><span>build next?</span></h2><a className="orbit-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={18} /></a></div><nav className="orbit-contact-links" aria-label="Contact links">{profile.links.map(link => <a key={link.href} href={link.href} target={link.href.startsWith('https://') ? '_blank' : undefined} rel={link.href.startsWith('https://') ? 'noopener noreferrer' : undefined}>{link.label}<ArrowUpRight size={18} /></a>)}</nav></section>
    </main><footer className="orbit-quick-footer"><span>{profile.handle} / ORBITAL WORKS</span><span>{profile.approach}</span><a href="#orbit-quick-content" aria-label="Back to top"><ArrowRight size={18} /></a></footer>
  </div>
}
