# KIZAKIXD — Orbital Works

A playable planetary portfolio built with Next.js App Router, React, TypeScript, Tailwind, React Three Fiber, and Three.js.

## Run locally

```sh
npm ci
npm run dev
```

Production checks:

```sh
npm run typecheck
npm run test:orbit
npm run build
```

## Explore

Four planetary systems organize selected development, concepts, and contributor records: Robinhood / Ethereum, Base, Solana, and Intelligence (Xiaomi / MiMo AI). Drag to orbit the camera and scroll or pinch to zoom. Choose **Explore orbit** to pilot the probe with WASD or arrow keys. Press E near a signal to inspect it. Clicking or tapping a satellite approaches and inspects that record automatically. Mobile offers a compact destination selector instead of a joystick.

**Quick View** at `/quick` presents the same project descriptions, organization context, and contact links without a canvas. It works with JavaScript disabled. No API key or environment variable is required. Reduced motion follows the operating system preference and can be changed in settings; low power reduces pixel ratio, surface detail, and stars.

## Edit content

- `data/profile.ts`: identity and contact links
- `data/projects.ts`: development records, explicitly labeled concepts, and sourced dates
- `data/relationships.ts`: explicit organization relationship types
- `data/orbit.ts`: system styling, signal slots, and runtime interfaces
- `data/timeline.ts` and `data/technologies.ts`: retained source records for future archive views

Scene signals reference record IDs. Project summaries are shared by the scene inspector and Quick View. Read `docs/project-provenance.md` before adding dates, deployment claims, or network affiliations. Private project source is not published here.

## Baseline and deployment

Working branch: `agent/developer-archive-3d`. Original production baseline: `agent/typography-refresh` at `d005ddfdfcb601a53ac537c2343c9c92a418ec06`. Vercel project: `porto`. The working branch receives preview deployments; production remains separate.

The planet, atmosphere, rings, satellites, and probe are procedural geometry and shaders. The scene uses no external models, runtime font downloads, or postprocessing. Brand marks identify the relevant ecosystem or technology, not a partnership or endorsement. See `docs/brand-sources.md` and `docs/verification.md`.
