export type SystemId = 'robinhood' | 'base' | 'solana' | 'mimo'
export interface OrbitalSystem {
  id: SystemId
  number: string
  name: string
  family: string
  title: string
  subtitle: string
  accent: string
  surface: string
  seed: number
}
export const systems: OrbitalSystem[] = [
  { id: 'robinhood', number: '01', name: 'Robinhood', family: 'ETHEREUM ECOSYSTEM', title: 'Emerald orbit', subtitle: 'Selected onchain development', accent: '#bfd99c', surface: '#254d43', seed: 2.4 },
  { id: 'base', number: '02', name: 'Base', family: 'ETHEREUM L2', title: 'The blue frontier', subtitle: 'Ideas for everyday onchain tools', accent: '#8bb8ef', surface: '#20436f', seed: 8.1 },
  { id: 'solana', number: '03', name: 'Solana', family: 'SOLANA ECOSYSTEM', title: 'Quiet velocity', subtitle: 'Experiments in fast, useful interfaces', accent: '#90d8c4', surface: '#36565f', seed: 13.6 },
  { id: 'mimo', number: '04', name: 'Intelligence', family: 'XIAOMI / MIMO AI', title: 'The thinking moon', subtitle: 'AI, model development & practical support', accent: '#dfc5a5', surface: '#6c6251', seed: 21.2 },
]
export interface OrbitDestination { id: string; nonce: number }
export interface OrbitStatus {
  longitude: number
  latitude: number
  nearest: string | null
  scanned: string[]
  moving: boolean
}
export interface OrbitSceneProps {
  system: SystemId
  piloting: boolean
  paused: boolean
  reducedMotion: boolean
  lowPower: boolean
  destination: OrbitDestination | null
  onReady: () => void
  onError: () => void
  onInspect: (id: string) => void
  onStatus: (status: OrbitStatus) => void
}
export interface OrbitSignal { id: string; label: string; longitude: number; latitude: number }
export const signalSlots: ReadonlyArray<readonly [number, number]> = [[0.35,0.22],[1.55,-0.28],[2.9,0.48],[4.45,-0.15],[5.55,0.35]]
