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
    <div className="utc-clock border-t border-border py-4 lg:min-w-[20rem] lg:border-l lg:border-t-0 lg:pl-6">
      <div className="mb-2.5 flex items-center justify-between font-mono text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <span>UTC / Live signal</span>
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="utc-live-dot h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          Online
        </span>
      </div>

      <time
        dateTime={isoDate}
        aria-label={current ? `UTC time ${hours}:${minutes}:${seconds}, ${date}` : "Loading UTC time"}
        className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch"
      >
        {[
          ["HH", hours],
          ["MM", minutes],
          ["SS", seconds],
        ].map(([label, value], index) => (
          <div key={label} className="contents">
            {index > 0 ? (
              <span className="utc-colon grid w-4 place-items-center font-mono text-lg text-primary" aria-hidden="true">
                :
              </span>
            ) : null}
            <span className="grid min-h-12 grid-cols-[auto_1fr] items-center border border-border bg-background/70 px-2.5">
              <span className="self-start pt-1.5 font-mono text-[0.48rem] font-semibold tracking-[0.1em] text-muted-foreground">
                {label}
              </span>
              <span className="justify-self-end font-mono text-[1.55rem] font-semibold leading-none tracking-[-0.08em] tabular-nums">
                {value}
              </span>
            </span>
          </div>
        ))}
      </time>

      <div className="mt-2 flex items-center justify-between border-t border-border pt-2 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Date / UTC+00</span>
        <span className="text-foreground tabular-nums">{date}</span>
      </div>
    </div>
  )
}
