'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Crosshair, Gauge, LoaderCircle, MoveUpRight, X } from 'lucide-react'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { relationships } from '@/data/relationships'
import { systems } from '@/data/orbit'
import type { OrbitStatus, SystemId } from '@/data/orbit'
import BrandGlyph, { OrbitMonogram } from './BrandGlyph'

export interface OrbitInterfaceProps {
  system: SystemId
  piloting: boolean
  ready: boolean
  unavailable: boolean
  lowPower: boolean
  reducedMotion: boolean
  status: OrbitStatus
  onSystem: (system: SystemId) => void
  onPilot: () => void
  onInspect: (id: string) => void
  onNavigate: (id: string) => void
  onLowPower: () => void
  onReducedMotion: () => void
}

export default function OrbitInterface({ system, piloting, ready, unavailable, lowPower, reducedMotion, status, onSystem, onPilot, onInspect, onNavigate, onLowPower, onReducedMotion }: OrbitInterfaceProps) {
  const current = systems.find(item => item.id === system) ?? systems[0]
  const selectedProjects = projects.filter(project => project.system === system)
  const intelligenceRecords = relationships.filter(record => record.zone === 'ai-lab')
  const signals = system === 'mimo'
    ? intelligenceRecords.map(record => ({ id: record.id, title: record.name, concept: false }))
    : selectedProjects.map(project => ({ id: project.id, title: project.title, concept: project.kind === 'concept' }))
  const scanned = signals.filter(signal => status.scanned.includes(signal.id)).length
  const nearestSignal = signals.find(signal => signal.id === status.nearest)
  const longitude = ((status.longitude * 180 / Math.PI + 180) % 360 + 360) % 360 - 180
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [destination, setDestination] = useState('')
  const settingsRef = useRef<HTMLDivElement>(null)
  const settingsButton = useRef<HTMLButtonElement>(null)

  useEffect(() => { setDestination(system === 'mimo' ? 'xiaomi' : projects.find(project => project.system === system)?.id ?? '') }, [system])
  useEffect(() => {
    if (!settingsOpen) return
    const dismiss = (event: PointerEvent) => { if (!settingsRef.current?.contains(event.target as Node)) setSettingsOpen(false) }
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setSettingsOpen(false); settingsButton.current?.focus() } }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', keyboard)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', keyboard) }
  }, [settingsOpen])

  return <div className={`orbit-interface ${piloting ? 'orbit-interface-pilot' : ''}`} style={{ '--orbit-accent': current.accent } as CSSProperties}>
    <header className="orbit-header"><a className="orbit-wordmark" href="/" aria-label="KIZAKIXD home"><OrbitMonogram /><span>{profile.handle.toLowerCase()}<span className="orbit-wordmark-period">.</span></span></a><nav className="orbit-main-nav" aria-label="Main navigation"><button onClick={() => onInspect('works')}>Works</button><button onClick={() => onInspect('profile')}>About</button><a href="/quick">Quick View<ArrowUpRight size={13} aria-hidden="true" /></a></nav><div className="orbit-header-actions"><div className="orbit-settings-wrap" ref={settingsRef}><button className="orbit-icon-button" aria-label="Experience settings" aria-expanded={settingsOpen} aria-controls="orbit-settings" onClick={() => setSettingsOpen(!settingsOpen)} ref={settingsButton}><Gauge size={18} /></button>{settingsOpen && <div id="orbit-settings" className="orbit-settings" role="group" aria-label="Experience preferences"><p className="orbit-eyebrow">Your experience</p><button onClick={onLowPower} aria-pressed={lowPower}><span>Low power</span><span className={`orbit-toggle ${lowPower ? 'is-on' : ''}`} /></button><button onClick={onReducedMotion} aria-pressed={reducedMotion}><span>Reduce motion</span><span className={`orbit-toggle ${reducedMotion ? 'is-on' : ''}`} /></button></div>}</div><button className="orbit-contact-button" onClick={() => onInspect('contact')} aria-label="Contact KIZAKIXD"><ArrowUpRight size={18} /></button></div></header>

    {!piloting && <section className="orbit-hero" aria-labelledby="orbit-hero-title"><p className="orbit-eyebrow orbit-intro-label"><span className="orbit-live-dot" />INDEPENDENT DEVELOPER / {profile.location}</p><h1 id="orbit-hero-title">A universe<br /><span>in progress.</span></h1><p className="orbit-hero-copy">{profile.bio}</p><div className="orbit-hero-actions"><button className="orbit-explore-button" onClick={onPilot} disabled={!ready || unavailable}>{unavailable ? <><span>World unavailable</span><X size={17} /></> : ready ? <><span>Explore orbit</span><MoveUpRight size={18} /></> : <><span>Preparing orbit</span><LoaderCircle className="orbit-spinner" size={17} /></>}</button><button className="orbit-quiet-button" onClick={() => onInspect('works')}>The collection<ArrowRight size={15} /></button></div><p className="orbit-entry-note" aria-live="polite">{unavailable ? <>The full collection is ready in <a href="/quick">Quick View</a>.</> : ready ? 'Small worlds. Different possibilities.' : 'The collection is available while the world loads.'}</p></section>}

    <section className="orbit-location" aria-label="Current orbit"><span className="orbit-location-number">{current.number}<span>/ 04</span></span><div><p className="orbit-eyebrow">{current.family}</p><h2>{current.title}</h2></div><span className="orbit-location-line" /></section>

    {piloting && <div className="orbit-pilot-caption"><p className="orbit-eyebrow"><span className="orbit-live-dot" />{status.moving ? 'NAVIGATING' : 'ORBIT CONTROL'}</p><h1>{current.title}</h1><p className="orbit-coordinate">{Math.abs(status.latitude * 180 / Math.PI).toFixed(1)}° {status.latitude >= 0 ? 'N' : 'S'}<span>/</span>{Math.abs(longitude).toFixed(1)}° {longitude >= 0 ? 'E' : 'W'}</p><button className="orbit-quiet-button" onClick={onPilot}>Back to overview<ArrowUpRight size={14} /></button></div>}

    <aside className="orbit-work-list" aria-label={`${current.name} collection`}><div className="orbit-work-heading"><span className="orbit-eyebrow">{piloting ? 'SELECT A SIGNAL' : system === 'mimo' ? 'CONNECTED RECORDS' : 'IN THIS ORBIT'}</span><span className="orbit-work-count">{piloting ? `${scanned} / ` : ''}{String(signals.length).padStart(2, '0')}{piloting ? ' SCANNED' : ''}</span></div>{selectedProjects.map(project => <button className="orbit-work-row" key={project.id} onClick={() => piloting ? onNavigate(project.id) : onInspect(project.id)} aria-label={`${piloting ? 'Navigate to' : 'View'} ${project.title}`}><span className="orbit-work-indicator">{status.scanned.includes(project.id) ? <Check size={11} /> : <span />}</span><strong>{project.title}</strong>{project.kind === 'concept' && <span className="orbit-concept-label">CONCEPT</span>}<ArrowUpRight size={14} aria-hidden="true" /></button>)}{system === 'mimo' && intelligenceRecords.map(record => <button className="orbit-work-row" key={record.id} onClick={() => piloting ? onNavigate(record.id) : onInspect(`relationship:${record.id}`)} aria-label={`${piloting ? 'Navigate to' : 'View'} ${record.name}`}><span className="orbit-work-indicator">{status.scanned.includes(record.id) ? <Check size={11} /> : <span />}</span><strong>{record.name}</strong><span className="orbit-concept-label">{record.type}</span><ArrowUpRight size={14} /></button>)}</aside>

    {piloting && <><div className="orbit-pilot-help"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span className="orbit-key-divider">/</span>arrows to fly</span><span>Drag to look<span className="orbit-key-divider">/</span><kbd>E</kbd> inspect</span></div>{status.nearest && <button className="orbit-inspect-button" onClick={() => status.nearest && onNavigate(status.nearest)} aria-label={`Inspect ${nearestSignal?.title ?? 'nearby signal'}`}><Crosshair size={18} /><span>Inspect {nearestSignal?.title ?? 'signal'}</span><kbd>E</kbd></button>}<div className="orbit-mobile-navigation">{signals.length > 0 ? <><label className="orbit-sr-only" htmlFor="orbit-destination">Choose a destination</label><select id="orbit-destination" value={destination} onChange={event => setDestination(event.target.value)}>{signals.map(signal => <option value={signal.id} key={signal.id}>{signal.title}{signal.concept ? ' · Concept' : ''}</option>)}</select><button onClick={() => onNavigate(destination)} disabled={!destination} aria-label="Fly to selected signal"><ArrowRight size={18} /></button></> : <button className="orbit-mobile-record-button" onClick={() => onInspect('works')}>Open the records<ArrowUpRight size={16} /></button>}</div></>}

    <footer className="orbit-footer"><div className="orbit-system-caption"><span className="orbit-eyebrow">CHOOSE YOUR ORBIT</span><ArrowDown size={12} aria-hidden="true" /></div><nav className="orbit-system-nav" aria-label="Choose an orbital system">{systems.map(item => <button key={item.id} className={`orbit-system-tab ${item.id === system ? 'is-active' : ''}`} onClick={() => onSystem(item.id)} aria-label={`Explore ${item.name} orbit`} aria-pressed={item.id === system} style={{ '--tab-accent': item.accent } as CSSProperties}><span className="orbit-tab-topline"><span>{item.number}</span><span className="orbit-tab-dot" /></span><span className="orbit-tab-identity"><BrandGlyph system={item.id} paired /><span>{item.id === 'mimo' ? 'Xiaomi / MiMo' : item.name}</span></span><span className="orbit-tab-detail">{item.id === 'mimo' ? 'AI & DEVELOPMENT' : item.id === 'robinhood' ? 'DEVELOPMENT' : 'CONCEPT COLLECTION'}</span></button>)}</nav><div className="orbit-footer-meta"><span>{profile.handle} / ORBITAL WORKS</span><span>{piloting ? 'TAP A SIGNAL TO EXPLORE' : 'AN ONGOING EXPLORATION'}</span></div></footer>
  </div>
}
