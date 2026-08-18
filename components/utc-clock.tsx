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
    <div className="utc-clock w-[9.75rem] border border-border bg-background/80 p-2.5 shadow-[4px_4px_0_hsl(var(--border)/0.22)] backdrop-blur-sm">
      <div className="mb-1.5 flex items-center justify-between font-mono text-[0.48rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
              <span className="utc-colon grid w-2.5 place-items-center font-mono text-sm text-primary" aria-hidden="true">
                :
              </span>
            ) : null}
            <span className="grid h-8 min-w-8 place-items-center border border-border bg-card/80">
              <span className="font-mono text-sm font-semibold leading-none tracking-[-0.06em] tabular-nums">
                {value}
              </span>
            </span>
          </div>
        ))}
      </time>

      <div className="mt-1.5 flex items-center justify-between border-t border-border pt-1.5 font-mono text-[0.45rem] uppercase tracking-[0.1em] text-muted-foreground">
        <span>Date</span>
        <span className="text-foreground tabular-nums">{date}</span>
      </div>
    </div>
  )
}
