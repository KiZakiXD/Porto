'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ArrowRight, ChevronDown, Gauge, Map, X, Footprints } from 'lucide-react'
import { profile, projects } from '@/data'
import { fixedArtifacts, zones } from '@/data/world'
import type { RecordId, WorldSnapshot, ZoneId } from '@/data/world'
import { ArchiveMark } from './QuickView'

interface HUDProps {
  snapshot: WorldSnapshot
  lowPower: boolean
  reducedMotion: boolean
  onNavigate: (zone: ZoneId) => void
  onInspect: (record: RecordId) => void
  onLowPower: () => void
  onReducedMotion: () => void
}

export default function ArchiveHUD({ snapshot, lowPower, reducedMotion, onNavigate, onInspect, onLowPower, onReducedMotion }: HUDProps) {
  const [mapOpen, setMapOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)
  const destinationsRef = useRef<HTMLDivElement>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const destinationsButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!mapOpen && !settingsOpen) return
    function dismissOutside(event: PointerEvent) {
      const target = event.target as Node
      if (settingsOpen && !settingsRef.current?.contains(target)) setSettingsOpen(false)
      if (mapOpen && !destinationsRef.current?.contains(target)) setMapOpen(false)
    }
    function dismissEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      if (mapOpen) { setMapOpen(false); destinationsButtonRef.current?.focus() }
      if (settingsOpen) { setSettingsOpen(false); settingsButtonRef.current?.focus() }
    }
    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('keydown', dismissEscape)
    return () => {
      document.removeEventListener('pointerdown', dismissOutside)
      document.removeEventListener('keydown', dismissEscape)
    }
  }, [mapOpen, settingsOpen])
  const currentZone = zones.find(zone => zone.id === snapshot.zone) ?? zones[0]
  const nearestName = snapshot.nearest?.startsWith('project:') ? projects.find(project => `project:${project.id}` === snapshot.nearest)?.title : fixedArtifacts.find(item => item.id === snapshot.nearest)?.label
  function navigate(zone: ZoneId) { onNavigate(zone); setMapOpen(false); destinationsButtonRef.current?.focus() }

  return <div className="archive-hud">
    <header className="hud-header"><a className="archive-brand" href="/" aria-label="KIZAKIXD archive home"><ArchiveMark /><span>{profile.handle}<small>THE DEVELOPER ARCHIVE</small></span></a><div className="hud-actions"><span className="hud-live"><span className="status-dot" />EXPLORING</span><div className="settings-wrap" ref={settingsRef}><button ref={settingsButtonRef} className="icon-button" onClick={() => { setSettingsOpen(!settingsOpen); setMapOpen(false) }} aria-expanded={settingsOpen} aria-controls="archive-settings" aria-label="Experience settings"><Gauge size={19} /></button>{settingsOpen && <div id="archive-settings" className="settings-popover"><p className="eyebrow">EXPERIENCE</p><button onClick={onLowPower} aria-pressed={lowPower}><span>Low power</span><span className={`toggle-indicator ${lowPower ? 'is-on' : ''}`} /></button><button onClick={onReducedMotion} aria-pressed={reducedMotion}><span>Reduce motion</span><span className={`toggle-indicator ${reducedMotion ? 'is-on' : ''}`} /></button></div>}</div><a className="outlined-button small-button" href="/quick">Quick View<ArrowUpRight size={14} /></a></div></header>
    <div className="hud-location"><div className="location-rule" /><p className="eyebrow">CHAMBER {currentZone.number} / {String(zones.length).padStart(2, '0')}</p><h1>{currentZone.name}</h1><p className="location-subtitle">{currentZone.subtitle}</p></div>
    <aside className="hud-minimap" aria-label="Archive map"><div className="map-label"><span className="eyebrow">THE ARCHIVE</span><span className="eyebrow">N ↑</span></div><svg viewBox="0 0 240 194" role="img" aria-label={`Current location: ${currentZone.name}`}><path d="M120 126V48M45 126H194M45 50H194M45 50V126M194 50V126" stroke="#444e49" fill="none" strokeWidth="2" strokeDasharray="3 4" />{zones.map(zone => { const x = 120 + zone.position[0] * 4.9, y = 109 + zone.position[1] * 4.2; const active = zone.id === snapshot.zone; return <g key={zone.id}><rect x={x - 20} y={y - 16} width={40} height={32} rx="1" fill={active ? '#273831' : '#171e1a'} stroke={active ? '#9dcbbb' : '#47534b'} strokeWidth={active ? '1.5' : '1'} /><text x={x} y={y + 4} fill={active ? '#ddede4' : '#8b9b90'} textAnchor="middle" fontSize="9" fontFamily="monospace">{zone.number}</text></g> })}<circle cx={120 + snapshot.position[0] * 4.9} cy={109 + snapshot.position[1] * 4.2} r="3.8" fill="#c4e9d8" stroke="#111a15" strokeWidth="1.5" /></svg><p><span className="status-dot" />You are here</p></aside>
    <div className="hud-bottom">
      <div className="movement-help"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / arrows to move</span><span><span className="pointer-symbol">↗</span> Click a destination</span></div>
      {snapshot.nearest && <button className="interact-button" aria-label={`Inspect ${nearestName ?? 'archive record'}`} onClick={() => onInspect(snapshot.nearest!)}><kbd>E</kbd><span><small>INSPECT RECORD</small>{nearestName ?? 'Open archive record'}</span><ArrowUpRight size={18} /></button>}
      {!snapshot.nearest && <div className="exploration-hint"><Footprints size={16} /><span>{snapshot.moving ? 'Moving through the archive' : 'Choose a destination to explore'}</span></div>}
      <div className="destination-control" ref={destinationsRef}><button ref={destinationsButtonRef} className={`destination-toggle ${mapOpen ? 'is-active' : ''}`} onClick={() => { setMapOpen(!mapOpen); setSettingsOpen(false) }} aria-expanded={mapOpen} aria-controls="archive-destinations"><Map size={17} /><span>Destinations</span>{mapOpen ? <X size={16} /> : <ChevronDown size={16} />}</button>{mapOpen && <nav id="archive-destinations" className="destination-menu" aria-label="Navigate the archive"><div className="destination-menu-heading"><p className="eyebrow">CHOOSE A CHAMBER</p><span>Auto-walk</span></div>{zones.map(zone => <button key={zone.id} className={zone.id === snapshot.zone ? 'is-current' : ''} onClick={() => navigate(zone.id)} aria-label={`Walk to ${zone.name}`} aria-current={zone.id === snapshot.zone ? 'location' : undefined}><span className="destination-number">{zone.number}</span><span><strong>{zone.name}</strong><small>{zone.subtitle}</small></span><ArrowRight size={16} /></button>)}</nav>}</div>
    </div>
    <p className="mobile-world-help">Tap the floor to walk · Tap an artifact to inspect</p>
  </div>
}
