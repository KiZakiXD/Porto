"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <p className="eyebrow">KIZAKIXD / RECONNECT</p>
      <h1>Let’s reconnect.</h1>
      <p>The page could not finish loading. Try reconnecting.</p>
      <button className="contact-button" onClick={reset}>
        Reload experience ↗
      </button>
      <a className="text-link" href="https://github.com/KiZakiXD">
        Visit GitHub ↗
      </a>
    </main>
  );
}
