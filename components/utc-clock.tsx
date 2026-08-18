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
    <div className="utc-clock font-mono uppercase">
      <time
        dateTime={isoDate}
        aria-label={current ? `UTC time ${hours}:${minutes}:${seconds}, ${date}` : "Loading UTC time"}
        className="grid justify-items-end gap-1 leading-none sm:flex sm:items-baseline sm:gap-3"
      >
        <span className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-[0.4rem] font-semibold tracking-[0.16em] text-muted-foreground sm:text-[0.43rem]">
            UTC+00
          </span>
          <span className="text-[0.68rem] font-semibold tracking-[0.04em] text-foreground tabular-nums sm:text-xs">
            {hours}<span className="utc-colon mx-0.5 text-primary" aria-hidden="true">:</span>{minutes}
            <span className="utc-colon mx-0.5 text-primary" aria-hidden="true">:</span>{seconds}
          </span>
        </span>

        <span className="flex items-center gap-1.5 whitespace-nowrap text-[0.39rem] font-medium tracking-[0.13em] text-muted-foreground sm:text-[0.42rem]">
          <span className="tabular-nums">{date}</span>
          <span className="text-primary" aria-hidden="true">/</span>
          <span className="flex items-center gap-1 text-foreground">
            <span className="utc-live-dot h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
            Live
          </span>
        </span>
      </time>
    </div>
  )
}
