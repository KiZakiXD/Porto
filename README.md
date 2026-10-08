# KIZAKIXD — The Developer Archive

An explorable developer portfolio built with Next.js App Router, React, TypeScript, Tailwind, React Three Fiber, and Three.js.

## Run locally

```sh
npm ci
npm run dev
```

Production checks:

```sh
npm run typecheck
npm run test:navigation
npm run build
```

## Explore

Enter the archive to move through the Central Hall, Archive Corridor, AI Laboratory, Onchain Chamber, Project Forge, and Communication Terminal. Use WASD or arrow keys, click/tap the floor to walk, and press E near a record to inspect it. Selecting an artifact approaches it automatically. The location navigation provides routes between rooms without requiring game controls.

Quick View at `/quick` presents the same content as a conventional portfolio. It is available without WebGL and includes all projects, relationships, timeline records, technologies, and contact links. No API key or environment variable is required.

## Edit content

- `data/profile.ts`: identity and contact links
- `data/projects.ts`: curated project records
- `data/relationships.ts`: explicit organization relationship types
- `data/timeline.ts`: dated, confirmed chapters
- `data/technologies.ts`: capability groups
- `data/world.ts`: locations and world/content identifiers

Both views consume these modules. World meshes reference record IDs instead of embedding long portfolio text. Private project source is not published here.

## Baseline and deployment

Implemented on `agent/developer-archive-3d`, based on production branch `agent/typography-refresh` at `d005ddfdfcb601a53ac537c2343c9c92a418ec06`. The Vercel project is `porto`. Keep preview and production promotion separate; the existing production branch remains available.

The scene uses local procedural geometry and materials, bounded device-pixel ratio, reduced-motion support, and a low-power option. There are no external models, runtime font downloads, postprocessing effects, or third-party asset licenses required for the world.
