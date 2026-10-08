import type { SystemId } from '@/data/orbit'

export function OrbitMonogram() {
  return <svg viewBox="0 0 32 32" fill="none" width="30" height="30" aria-hidden="true"><circle cx="16" cy="16" r="8.5" stroke="currentColor" strokeWidth="1.2" /><ellipse cx="16" cy="16" rx="15" ry="4.5" stroke="currentColor" strokeWidth="1.2" transform="rotate(-38 16 16)" /><circle cx="26.7" cy="7.5" r="2" fill="currentColor" /></svg>
}

export function EthereumGlyph() {
  return <svg className="orbit-ethereum" width="14" height="21" viewBox="0 0 20 32" aria-hidden="true"><path d="M10 0 0 17l10 6 10-6L10 0Z" fill="currentColor" opacity=".88" /><path d="M10 0v23l10-6L10 0Z" fill="currentColor" opacity=".4" /><path d="m0 19 10 13 10-13-10 6-10-6Z" fill="currentColor" opacity=".8" /></svg>
}

export default function BrandGlyph({ system, paired = false }: { system: SystemId; paired?: boolean }) {
  return <span className={`orbit-brand-glyph orbit-brand-${system}`} aria-hidden="true">
    {paired && (system === 'robinhood' || system === 'base') && <><EthereumGlyph /><span className="orbit-brand-separator" /></>}
    {system === 'robinhood' && <svg width="22" height="28" viewBox="0 0 26 32" fill="none"><path d="M22 2C10 2 4 9 5 23L17 18 22 2Z" fill="currentColor" opacity=".9" /><path d="m3 30 14-21M8 22l2-11M12 17l8-6" stroke="var(--orbit-bg, #0a0d0c)" strokeWidth="1.5" /><path d="m3 30 14-21" stroke="currentColor" strokeWidth="1.5" /></svg>}
    {system === 'base' && <img className="orbit-base-mark" src="/brands/base-square.svg" width="25" height="25" alt="" />}
    {system === 'solana' && <svg width="29" height="25" viewBox="0 0 34 28" fill="currentColor"><path d="M7 1h26l-6 6H1l6-6Z" /><path d="M1 11h26l6 6H7l-6-6Z" opacity=".75" /><path d="M7 21h26l-6 6H1l6-6Z" opacity=".55" /></svg>}
    {system === 'mimo' && <svg width="29" height="29" viewBox="0 0 32 32" fill="none"><rect x="2" y="2" width="28" height="28" rx="9" fill="currentColor" /><path d="M8 11h8c3 0 4 1.5 4 4v7h-3v-7c0-.8-.4-1.2-1.2-1.2H11V22H8V11Zm5 5h2.5v6H13v-6Zm9-5h3v11h-3V11Z" fill="#292720" /></svg>}
  </span>
}
