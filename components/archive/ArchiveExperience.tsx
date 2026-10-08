'use client'

import dynamic from 'next/dynamic'
import { Component, useCallback, useEffect, useRef, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, CircleAlert, LoaderCircle } from 'lucide-react'
import { profile, projects } from '@/data'
import { zones } from '@/data/world'
import type { NavigationRequest, RecordId, WorldSnapshot, ZoneId } from '@/data/world'
import ArchiveHUD from './ArchiveHUD'
import ArchivePanel from './ArchivePanel'
import QuickView, { ArchiveMark } from './QuickView'

const ArchiveWorld = dynamic(() => import('./world/ArchiveWorld'), { ssr: false, loading: () => null })

class WorldBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(_error: Error, _info: ErrorInfo) { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

type ExperienceMode = 'intro' | 'world' | 'quick'
type EngineState = 'checking' | 'loading' | 'ready' | 'unavailable'
const initialSnapshot: WorldSnapshot = { zone: 'central-hall', position: [0, 5], nearest: null, moving: false }

export default function ArchiveExperience() {
  const [mode, setMode] = useState<ExperienceMode>('intro')
  const [engine, setEngine] = useState<EngineState>('checking')
  const [record, setRecord] = useState<RecordId | null>(null)
  const [snapshot, setSnapshot] = useState<WorldSnapshot>(initialSnapshot)
  const [destination, setDestination] = useState<NavigationRequest | null>(null)
  const [lowPower, setLowPower] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [loadingSlow, setLoadingSlow] = useState(false)
  const nonce = useRef(0)
  const worldEntered = mode === 'world'

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('view') === 'quick') setMode('quick')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motion.matches)
    const syncMotion = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    motion.addEventListener('change', syncMotion)
    try { const preference = localStorage.getItem('archive-low-power'); setLowPower(preference === 'true' || (preference === null && (navigator.hardwareConcurrency || 8) <= 4)) } catch { /* Storage is optional. */ }
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false })
      if (!gl) setEngine('unavailable')
      else { gl.getExtension('WEBGL_lose_context')?.loseContext(); setEngine('loading') }
    } catch { setEngine('unavailable') }
    return () => motion.removeEventListener('change', syncMotion)
  }, [])

  useEffect(() => {
    if (engine !== 'loading') return
    const timer = window.setTimeout(() => setLoadingSlow(true), 15000)
    return () => window.clearTimeout(timer)
  }, [engine])

  const onReady = useCallback(() => setEngine('ready'), [])
  const onError = useCallback(() => { setEngine('unavailable'); setRecord(null); setMode('intro') }, [])
  const onInspect = useCallback((value: RecordId) => setRecord(value), [])
  const closeRecord = useCallback(() => setRecord(null), [])
  const requestInspection = useCallback((value: RecordId) => setDestination({ point: [0, 0], record: value, nonce: ++nonce.current }), [])
  const onSnapshot = useCallback((value: WorldSnapshot) => setSnapshot(previous => (
    previous.zone === value.zone && previous.nearest === value.nearest && previous.moving === value.moving &&
    previous.position[0] === value.position[0] && previous.position[1] === value.position[1]
  ) ? previous : value), [])
  const navigate = useCallback((zoneId: ZoneId) => { const zone = zones.find(item => item.id === zoneId); if (zone) setDestination({ point: zone.position, nonce: ++nonce.current }) }, [])
  const toggleLowPower = useCallback(() => setLowPower(previous => { const next = !previous; try { localStorage.setItem('archive-low-power', String(next)) } catch { /* Storage is optional. */ } return next }), [])

  if (mode === 'quick') return <QuickView onExplore={() => { window.history.replaceState({}, '', window.location.pathname); setMode('intro') }} />

  return <main className={`archive-experience ${worldEntered ? 'has-entered' : 'is-intro'}`} data-zone={snapshot.zone} data-position={snapshot.position.join(",")} data-moving={snapshot.moving} aria-label="KIZAKIXD interactive developer archive">
    <a className="skip-link" href="/quick">Skip the world — read the portfolio</a>
    <div className="archive-world" aria-label="Explorable archive world">{(engine === 'loading' || engine === 'ready') && <WorldBoundary onError={onError}><ArchiveWorld entered={worldEntered} paused={Boolean(record)} reducedMotion={reducedMotion} lowPower={lowPower} destination={destination} onSnapshot={onSnapshot} onInspect={onInspect} onReady={onReady} onError={onError} /></WorldBoundary>}</div>
    <div className="world-vignette" aria-hidden="true" />
    {!worldEntered && <div className="archive-intro">
      <header className="intro-header"><a className="archive-brand" href="/"><ArchiveMark /><span>{profile.handle}<small>THE DEVELOPER ARCHIVE</small></span></a><span className="intro-edition eyebrow">A PERSONAL COLLECTION / VOL. 01</span><a className="intro-quick-link" href="/quick">Quick View<ArrowUpRight size={15} /></a></header>
      <section className="intro-content"><p className="eyebrow intro-status"><span className="status-dot" />ARCHIVE INITIALIZED<span className="status-line" /></p><h1>{profile.handle}</h1><h2>The Developer<br /><span>Archive.</span></h2><p className="intro-description">{profile.bio}</p><div className="intro-actions"><button className="enter-button" disabled={engine !== 'ready'} onClick={() => setMode('world')}>{engine === 'checking' || engine === 'loading' ? <><LoaderCircle size={16} className="loading-spinner" /><span>PREPARING ARCHIVE</span></> : engine === 'unavailable' ? <><CircleAlert size={17} /><span>WORLD UNAVAILABLE</span></> : <><span>ENTER ARCHIVE</span><ArrowRight size={19} /></>}</button><a className="quick-enter-link" href="/quick">Quick View<ArrowUpRight size={17} /></a></div><p className="entry-caption" aria-live="polite">{engine === 'unavailable' ? 'Explore the complete portfolio in Quick View.' : loadingSlow && engine === 'loading' ? 'The world is taking a moment. Quick View is ready now.' : engine === 'ready' ? 'A small world of systems, experiments, and things built.' : 'Assembling the world. Quick View is ready now.'}</p></section>
      <div className="intro-world-caption" aria-hidden="true"><span className="caption-cross">+</span><div><p className="eyebrow">00 / CENTRAL HALL</p><p>Your journey starts here.</p></div></div>
      <footer className="intro-footer"><div className="intro-index"><span><strong>{String(zones.length).padStart(2, '0')}</strong>CONNECTED ROOMS</span><span><strong>{String(projects.length).padStart(2, '0')}</strong>SELECTED ARTIFACTS</span></div><div className="intro-footer-end"><span className="eyebrow">{profile.location}</span><span className="intro-footer-line" /><span className="eyebrow">BUILT TO BE EXPLORED</span></div></footer>
      <noscript><div className="no-script-message">The interactive archive needs JavaScript. <a href="/quick">Read the complete portfolio in Quick View.</a></div></noscript>
    </div>}
    {worldEntered && <ArchiveHUD snapshot={snapshot} lowPower={lowPower} reducedMotion={reducedMotion} onNavigate={navigate} onInspect={requestInspection} onLowPower={toggleLowPower} onReducedMotion={() => setReducedMotion(previous => !previous)} />}
    {record && <ArchivePanel record={record} onClose={closeRecord} onSelect={onInspect} />}
  </main>
}
