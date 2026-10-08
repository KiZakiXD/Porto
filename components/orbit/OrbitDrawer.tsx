'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { relationships } from '@/data/relationships'
import type { Project } from '@/data/projects'
import { systems } from '@/data/orbit'
import BrandGlyph from './BrandGlyph'

export function OrbitProjectLinks({ project }: { project: Project }) {
  return <div className="orbit-project-links">{project.links.length ? project.links.map(link => <a className="orbit-link" key={link.href} href={link.href} target={link.href.startsWith('https://') ? '_blank' : undefined} rel={link.href.startsWith('https://') ? 'noopener noreferrer' : undefined} aria-label={`${link.label}: ${project.title}`}>{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a>) : <a className="orbit-link" href={`mailto:${profile.email}?subject=${encodeURIComponent(project.title)}`}>Talk about this {project.kind === 'concept' ? 'idea' : 'work'}<ArrowUpRight size={16} aria-hidden="true" /></a>}</div>
}

export default function OrbitDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const [activeId, setActiveId] = useState(id)
  const drawerRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const headingId = useId()
  const project = projects.find(item => item.id === activeId.replace(/^project:/, ''))
  const relationship = relationships.find(item => item.id === activeId.replace(/^relationship:/, ''))
  const system = (project ? systems.find(item => item.id === project.system) : relationship?.zone === 'ai-lab' ? systems[3] : systems[0]) ?? systems[0]
  const title = project?.title ?? relationship?.name ?? (activeId === 'works' ? 'The collection.' : activeId === 'contact' ? 'Open a channel.' : profile.name)

  useEffect(() => { setActiveId(id) }, [id])
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const background = document.querySelector<HTMLElement>('.orbit-interface')
    const previouslyInert = background?.inert ?? false
    const overflow = document.body.style.overflow
    if (background) background.inert = true
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); return }
      if (event.key !== 'Tab') return
      const items = drawerRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]')
      if (!items?.length) return
      const first = items[0], last = items[items.length - 1]
      if (!drawerRef.current?.contains(document.activeElement)) { event.preventDefault(); first.focus() }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => {
      if (background) background.inert = previouslyInert
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', keydown)
      if (previous?.isConnected) previous.focus()
    }
  }, [onClose])
  useEffect(() => { drawerRef.current?.scrollTo({ top: 0 }); closeRef.current?.focus() }, [activeId])

  return <div className="orbit-drawer-shell" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="orbit-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-labelledby={headingId} tabIndex={-1} style={{ '--orbit-accent': system?.accent ?? '#bfd99c' } as CSSProperties}>
      <div className="orbit-drawer-toolbar"><span className="orbit-eyebrow">{project ? 'SELECTED WORK' : relationship ? 'RELATIONSHIP RECORD' : 'ORBITAL WORKS'}</span><button className="orbit-icon-button" onClick={onClose} ref={closeRef} aria-label="Close details"><X size={21} /></button></div>
      <div className="orbit-drawer-content">
        {project && system && <div className="orbit-drawer-network"><BrandGlyph system={system.id} paired /><span>{system.family}</span></div>}
        {relationship?.zone === 'ai-lab' && <div className="orbit-drawer-network"><BrandGlyph system="mimo" /><span>XIAOMI / MIMO AI</span></div>}
        <h2 id={headingId}>{title}</h2>
        {project && <><div className="orbit-record-badges"><span className={`orbit-badge ${project.kind === 'concept' ? 'orbit-badge-concept' : ''}`}>{project.kind === 'concept' ? 'CONCEPT' : 'DEVELOPMENT'}</span>{project.relationship && <span className="orbit-record-type">{project.relationship}</span>}</div><div className="orbit-record-art" aria-hidden="true"><div className={`orbit-mini-planet orbit-mini-${project.system}`} /><div className="orbit-record-orbit" /><span className="orbit-record-art-index">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span className="orbit-record-art-label">{project.shortTag}</span></div><p className="orbit-drawer-description">{project.description}</p><dl className="orbit-record-facts"><div><dt>Ecosystem</dt><dd>{system.name === 'Intelligence' ? 'Xiaomi / MiMo' : system.name}</dd></div>{project.date && <div><dt>{project.date.label}</dt><dd>{project.date.value}</dd></div>}</dl><OrbitProjectLinks project={project} /><button className="orbit-drawer-back" onClick={() => setActiveId('works')}><ArrowLeft size={14} />The full collection</button></>}
        {relationship && <><span className="orbit-badge">{relationship.type}</span><p className="orbit-drawer-description orbit-relationship-description">{relationship.summary}</p><a className="orbit-link" href={`mailto:${profile.email}`}>Start a conversation<ArrowUpRight size={16} /></a></>}
        {activeId === 'profile' && <><p className="orbit-profile-role">{profile.title} / {profile.location}</p><p className="orbit-drawer-description">{profile.bio}</p><blockquote className="orbit-profile-approach">{profile.approach}</blockquote><div className="orbit-about-records"><p className="orbit-eyebrow">CONTEXT & CONNECTIONS</p>{relationships.map(item => <button key={item.id} onClick={() => setActiveId(`relationship:${item.id}`)}><span>{item.name}</span><small>{item.type}</small><ArrowUpRight size={14} /></button>)}</div><button className="orbit-link" onClick={() => setActiveId('contact')}>Get in touch<ArrowUpRight size={16} /></button></>}
        {activeId === 'contact' && <><p className="orbit-drawer-description">{profile.approach}</p><a className="orbit-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={16} /></a><nav className="orbit-contact-links" aria-label="Contact links">{profile.links.map(link => <a key={link.href} href={link.href} target={link.href.startsWith('https://') ? '_blank' : undefined} rel={link.href.startsWith('https://') ? 'noopener noreferrer' : undefined}><span>{link.label}</span><ArrowUpRight size={18} /></a>)}</nav></>}
        {activeId === 'works' && <div className="orbit-drawer-collection">{systems.map(item => <section key={item.id}><div className="orbit-collection-heading"><BrandGlyph system={item.id} /><span>{item.id === 'mimo' ? 'Xiaomi / MiMo' : item.name}</span></div>{projects.filter(work => work.system === item.id).map(work => <button key={work.id} className="orbit-collection-record" onClick={() => setActiveId(work.id)}><span><strong>{work.title}</strong><small>{work.kind === 'concept' ? 'CONCEPT' : work.category}</small></span><ArrowUpRight size={17} /></button>)}{item.id === 'mimo' && relationships.filter(entry => entry.zone === 'ai-lab').map(entry => <button key={entry.id} className="orbit-collection-record" onClick={() => setActiveId(`relationship:${entry.id}`)}><span><strong>{entry.name}</strong><small>{entry.type}</small></span><ArrowUpRight size={17} /></button>)}</section>)}</div>}
        <button className="orbit-drawer-return" onClick={onClose}>Return to orbit<ArrowRight size={15} /></button>
      </div>
    </section>
  </div>
}
