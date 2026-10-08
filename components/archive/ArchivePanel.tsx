'use client'

import { useEffect, useId, useRef } from 'react'
import { ArrowUpRight, ArrowLeft, X } from 'lucide-react'
import { profile, projects, relationships, technologies, timeline } from '@/data'
import type { Project, Relationship } from '@/data'
import { zones } from '@/data/world'
import type { RecordId } from '@/data/world'

export function RelationshipList({ items }: { items: Relationship[] }) {
  return <div className="relationship-list">{items.map(item => <article className="relationship-record" key={item.id}>
    <div className="relationship-heading"><h3>{item.name}</h3><span className="archive-tag">{item.type}</span></div>
    <p>{item.summary}</p>
  </article>)}</div>
}

export function TimelineList() {
  return <ol className="timeline-list">{timeline.map(entry => <li key={entry.id}>
    <span className="timeline-year">{entry.year}</span><div><h3>{entry.title}</h3><p>{entry.description}</p></div>
  </li>)}</ol>
}

export function ProjectLinks({ project }: { project: Project }) {
  return <div className="record-links">{project.links.map(link => <a className="text-link" href={link.href} key={link.href} aria-label={`${link.label}: ${project.title}`} target={link.href.startsWith('https://') ? '_blank' : undefined} rel={link.href.startsWith('https://') ? 'noopener noreferrer' : undefined}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>
}

export function ContactLinks() {
  return <div className="contact-links">{profile.links.map((link, index) => <a href={link.href} key={link.label} target={link.href.startsWith('https://') ? '_blank' : undefined} rel={link.href.startsWith('https://') ? 'noopener noreferrer' : undefined}>
    <span className="contact-link-number">0{index + 1}</span><span>{link.label}</span><ArrowUpRight size={20} aria-hidden="true" />
  </a>)}</div>
}

export default function ArchivePanel({ record, onClose, onSelect }: { record: RecordId; onClose: () => void; onSelect: (record: RecordId) => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const headingId = useId()
  const project = record.startsWith('project:') ? projects.find(item => item.id === record.slice(8)) : undefined
  const zone = zones.find(item => item.record === record) ?? (project ? zones.find(item => item.id === 'project-forge') : zones[0])!
  const title = project?.title ?? ({ profile: 'The developer', timeline: 'Chapters in the making', 'ai-lab': 'AI & automation', onchain: 'Onchain records', contact: 'Open a channel' } as Record<string, string>)[record] ?? 'Archive record'

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); return }
      if (event.key !== 'Tab') return
      const items = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]')
      if (!items?.length) return
      const first = items[0], last = items[items.length - 1]
      if (!panelRef.current?.contains(document.activeElement)) { event.preventDefault(); first.focus() }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      if (previous?.isConnected) previous.focus()
    }
  }, [onClose])

  useEffect(() => { panelRef.current?.scrollTo({ top: 0 }); closeRef.current?.focus() }, [record])

  return <div className="panel-scrim" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="archive-panel" ref={panelRef} role="dialog" tabIndex={-1} aria-modal="true" aria-labelledby={headingId}>
      <div className="panel-toolbar"><span className="eyebrow">RECORD / {zone.number}</span><button className="icon-button" onClick={onClose} ref={closeRef} aria-label="Close archive record"><X size={21} /></button></div>
      <div className="panel-content">
        <p className="eyebrow accent-text">{project?.category ?? zone.name}</p>
        <h2 id={headingId}>{title}</h2>
        {record === 'profile' && <>
          <p className="panel-lead">{profile.name}</p><p>{profile.bio}</p>
          <blockquote>{profile.approach}</blockquote>
          <div className="profile-facts"><span>Based in</span><strong>{profile.location}</strong></div>
          <h3 className="section-label">Tools of the trade</h3><div className="technology-groups">{technologies.map(group => <section key={group.id}><h4>{group.name}</h4><p>{group.items.join(' · ')}</p></section>)}</div>
          <button className="text-link" onClick={() => onSelect('contact')}>Start a conversation<ArrowUpRight size={15} /></button>
        </>}
        {record === 'timeline' && <TimelineList />}
        {record === 'ai-lab' && <>
          <RelationshipList items={relationships.filter(item => item.zone === 'ai-lab')} />
          <h3 className="section-label">Related artifacts</h3><div className="related-projects">{projects.filter(item => item.category.startsWith('AI')).map(item => <button key={item.id} onClick={() => onSelect(`project:${item.id}`)}><span><small>{item.category}</small><strong>{item.title}</strong></span><ArrowUpRight size={19} /></button>)}</div>
        </>}
        {record === 'onchain' && <>
          <RelationshipList items={relationships.filter(item => item.zone === 'onchain')} />
          <h3 className="section-label">Related artifacts</h3><div className="related-projects">{projects.filter(item => ['xypher', 'nextfly', 'solmera'].includes(item.id)).map(item => <button key={item.id} onClick={() => onSelect(`project:${item.id}`)}><span><small>{item.category}</small><strong>{item.title}</strong></span><ArrowUpRight size={19} /></button>)}</div>
        </>}
        {record === 'contact' && <><p className="panel-lead">{profile.approach}</p><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a><ContactLinks /></>}
        {project && <>
          <p className="panel-lead">{project.summary}</p>
          <div className="project-meta"><span>{project.year}</span>{project.relationship && <span className="archive-tag">{project.relationship}</span>}<span>{project.status}</span></div>
          <div className="artifact-illustration" aria-hidden="true"><span className="artifact-outline" /><span className="artifact-axis" /><span className="artifact-code">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span className="artifact-caption">{project.category}</span></div>
          <p>{project.description}</p><div className="tech-tags">{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div><ProjectLinks project={project} />
          <h3 className="section-label">More from the forge</h3><div className="related-projects">{projects.filter(item => item.id !== project.id).slice(0, 3).map(item => <button key={item.id} onClick={() => onSelect(`project:${item.id}`)}><span><small>{item.category}</small><strong>{item.title}</strong></span><ArrowUpRight size={19} /></button>)}</div>
        </>}
        <button className="return-button" onClick={onClose}><ArrowLeft size={15} /> Return to the archive</button>
      </div>
    </div>
  </div>
}
