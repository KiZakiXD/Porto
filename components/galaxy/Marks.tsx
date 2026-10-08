import {
  ArrowLeftRight,
  Box,
  Fingerprint,
  Layers3,
  Orbit,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Project } from "@/data/portfolio";

export function StarMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m16 0 3.9 12.1L32 16l-12.1 3.9L16 32l-3.9-12.1L0 16l12.1-3.9L16 0Z"
        fill="currentColor"
      />
      <circle cx="16" cy="16" r="3.5" fill="#080b12" />
    </svg>
  );
}
export function EthereumMark() {
  return (
    <svg width="18" height="27" viewBox="0 0 20 32" aria-hidden="true">
      <path
        d="m10 0 10 17-10 6L0 17 10 0Zm0 25 10-6-10 13L0 19l10 6Z"
        fill="currentColor"
      />
      <path d="m10 0 10 17-10 6V0Z" fill="#080b12" opacity=".4" />
    </svg>
  );
}
export function NetworkMark({ network }: { network: string }) {
  if (network === "base")
    return <span className="base-mark" aria-hidden="true" />;
  if (network === "solana")
    return (
      <svg
        width="33"
        height="27"
        viewBox="0 0 34 28"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7 1h26l-6 6H1l6-6ZM1 11h26l6 6H7l-6-6ZM7 21h26l-6 6H1l6-6Z" />
      </svg>
    );
  return <EthereumMark />;
}
export function ProjectMark({
  symbol,
  size = 26,
}: {
  symbol: Project["symbol"];
  size?: number;
}) {
  const icons = {
    shield: ShieldCheck,
    cube: Box,
    nodes: Layers3,
    orbit: Orbit,
    wave: Radar,
    lock: Fingerprint,
    exchange: ArrowLeftRight,
    spark: Sparkles,
  };
  const Icon = icons[symbol];
  return <Icon size={size} strokeWidth={1.25} aria-hidden="true" />;
}
