"use client"

import { useEffect, useState } from "react"

const pad = (value: number) => value.toString().padStart(2, "0")

export default function UtcClock() {
  const [timestamp, setTimestamp] = useState<number | null>(null)

  useEffect(() => {
    let timer = 0

    const sync = () => {
      const current = Date.now()
      setTimestamp(current)
      timer = window.setTimeout(sync, 1010 - (current % 1000))
    }

    sync()
    return () => window.clearTimeout(timer)
  }, [])

  const current = timestamp === null ? null : new Date(timestamp)
  const hours = current ? pad(current.getUTCHours()) : "--"
  const minutes = current ? pad(current.getUTCMinutes()) : "--"
  const seconds = current ? pad(current.getUTCSeconds()) : "--"
  const date = current
    ? `${current.getUTCFullYear()}.${pad(current.getUTCMonth() + 1)}.${pad(current.getUTCDate())}`
    : "----.--.--"
  const isoDate = current?.toISOString()

  return (
    <div className="utc-clock w-[8.4rem] bg-transparent p-0 md:w-[9.75rem] md:border md:border-border md:bg-background/80 md:p-2.5 md:shadow-[4px_4px_0_hsl(var(--border)/0.22)] md:backdrop-blur-sm">
      <div className="mb-1 flex items-center justify-between font-mono text-[0.45rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:mb-1.5 md:text-[0.48rem]">
        <span>UTC +00</span>
        <span className="flex items-center gap-1 text-foreground">
          <span className="utc-live-dot h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
          Live
        </span>
      </div>

      <time
        dateTime={isoDate}
        aria-label={current ? `UTC time ${hours}:${minutes}:${seconds}, ${date}` : "Loading UTC time"}
        className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center"
      >
        {[
          ["HH", hours],
          ["MM", minutes],
          ["SS", seconds],
        ].map(([label, value], index) => (
          <div key={label} className="contents">
            {index > 0 ? (
              <span className="utc-colon grid w-2 place-items-center font-mono text-xs text-primary md:w-2.5 md:text-sm" aria-hidden="true">
                :
              </span>
            ) : null}
            <span className="grid min-w-0 place-items-center md:h-8 md:min-w-8 md:border md:border-border md:bg-card/80">
              <span className="font-mono text-xs font-semibold leading-none tracking-[-0.04em] tabular-nums md:text-sm md:tracking-[-0.06em]">
                {value}
              </span>
            </span>
          </div>
        ))}
      </time>

      <div className="mt-1 flex items-center justify-end font-mono text-[0.43rem] uppercase tracking-[0.1em] text-muted-foreground md:mt-1.5 md:justify-between md:border-t md:border-border md:pt-1.5 md:text-[0.45rem]">
        <span className="hidden md:inline">Date</span>
        <span className="text-foreground tabular-nums">{date}</span>
      </div>
    </div>
  )
}
