"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <p className="eyebrow">KIZAKIXD / RECONNECT</p>
      <h1>A moment between worlds.</h1>
      <p>The page could not finish loading. Try reconnecting.</p>
      <button className="primary-button" onClick={reset}>
        Reload experience ↗
      </button>
      <a className="text-button" href="https://github.com/KiZakiXD">
        Visit GitHub ↗
      </a>
    </main>
  );
}
