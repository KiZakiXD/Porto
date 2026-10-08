import type { Metadata } from 'next'
import QuickView from '@/components/archive/QuickView'

export const metadata: Metadata = {
  title: 'Quick View — KIZAKIXD Developer Archive',
  description: 'Selected projects, experience, technologies, and contact details for independent developer Aldi Zakia Pratama.',
  alternates: { canonical: '/quick' },
}

export default function QuickPage() {
  return <QuickView />
}
