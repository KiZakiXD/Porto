'use client'
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="orbit-error"><p>KIZAKIXD / ORBITAL WORKS</p><h1>Let’s reconnect.</h1><p>The interactive view could not load.</p><a href="/quick">Open Quick View</a><button onClick={reset}>Try again</button></main>
}
