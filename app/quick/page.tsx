import type { Metadata } from 'next'
import OrbitQuickView from '@/components/orbit/OrbitQuickView'
export const metadata: Metadata = { title: 'Selected Work — KIZAKIXD', alternates: { canonical: '/quick' } }
export default function QuickPage() { return <OrbitQuickView /> }
