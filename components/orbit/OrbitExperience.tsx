'use client'

import dynamic from 'next/dynamic'
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { OrbitDestination, OrbitStatus, SystemId } from '@/data/orbit'
import OrbitInterface from './OrbitInterface'
import OrbitDrawer from './OrbitDrawer'

const OrbitScene = dynamic(() => import('./OrbitScene'), { ssr: false })
type Engine = 'checking' | 'loading' | 'ready' | 'unavailable'
const initialStatus: OrbitStatus = { longitude: 0, latitude: 0.2, nearest: null, scanned: [], moving: false }

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

export default function OrbitExperience() {
  const [system, setSystem] = useState<SystemId>('robinhood')
  const [engine, setEngine] = useState<Engine>('checking')
  const [piloting, setPiloting] = useState(false)
  const [lowPower, setLowPower] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [record, setRecord] = useState<string | null>(null)
  const [destination, setDestination] = useState<OrbitDestination | null>(null)
  const [status, setStatus] = useState<OrbitStatus>(initialStatus)
  const nonce = useRef(0)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motion.matches)
    const syncMotion = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    motion.addEventListener('change', syncMotion)
    try {
      const stored = localStorage.getItem('orbit-low-power')
      setLowPower(stored === 'true' || (stored === null && (navigator.hardwareConcurrency || 8) <= 4))
    } catch { /* Preferences are optional. */ }
    try {
      const gl = document.createElement('canvas').getContext('webgl2')
      if (!gl) setEngine('unavailable')
      else { gl.getExtension('WEBGL_lose_context')?.loseContext(); setEngine('loading') }
    } catch { setEngine('unavailable') }
    return () => motion.removeEventListener('change', syncMotion)
  }, [])

  const onReady = useCallback(() => setEngine('ready'), [])
  const onError = useCallback(() => { setEngine('unavailable'); setPiloting(false) }, [])
  const onInspect = useCallback((id: string) => setRecord(id === 'xiaomi' || id === 'mimo-ai' ? `relationship:${id}` : id), [])
  const onClose = useCallback(() => setRecord(null), [])
  const onSystem = useCallback((id: SystemId) => {
    setSystem(id); setPiloting(false); setDestination(null); setRecord(null); setStatus(initialStatus)
  }, [])
  const onNavigate = useCallback((id: string) => {
    if (engine !== 'ready') { onInspect(id); return }
    setDestination({ id, nonce: ++nonce.current })
    setPiloting(true)
  }, [engine, onInspect])
  const onStatus = useCallback((next: OrbitStatus) => setStatus(previous => (
    previous.longitude === next.longitude && previous.latitude === next.latitude &&
    previous.nearest === next.nearest && previous.moving === next.moving &&
    previous.scanned.join(',') === next.scanned.join(',')
  ) ? previous : next), [])
  const onLowPower = useCallback(() => setLowPower(previous => {
    const next = !previous
    try { localStorage.setItem('orbit-low-power', String(next)) } catch { /* Optional storage. */ }
    return next
  }), [])

  return <main className={`orbit-experience ${piloting ? 'is-piloting' : 'is-showcase'}`} data-system={system} data-longitude={status.longitude} data-latitude={status.latitude} data-moving={status.moving} data-scanned={status.scanned.join(',')}>
    <a className="orbit-skip-link" href="/quick">Skip to the portfolio</a>
    <div className="orbit-canvas" aria-label="Interactive planetary portfolio">
      {(engine === 'loading' || engine === 'ready') && <SceneBoundary onError={onError}><OrbitScene system={system} piloting={piloting} paused={Boolean(record)} reducedMotion={reducedMotion} lowPower={lowPower} destination={destination} onReady={onReady} onError={onError} onInspect={onInspect} onStatus={onStatus} /></SceneBoundary>}
    </div>
    <OrbitInterface system={system} piloting={piloting} ready={engine === 'ready'} unavailable={engine === 'unavailable'} lowPower={lowPower} reducedMotion={reducedMotion} status={status} onSystem={onSystem} onPilot={() => { if (engine === 'ready') setPiloting(previous => !previous) }} onInspect={onInspect} onNavigate={onNavigate} onLowPower={onLowPower} onReducedMotion={() => setReducedMotion(previous => !previous)} />
    {record && <OrbitDrawer id={record} onClose={onClose} />}
    <noscript><div className="orbit-noscript">Read the complete portfolio in <a href="/quick">Quick View</a>.</div></noscript>
  </main>
}
