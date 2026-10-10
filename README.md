# KizakiXD — Ideas into Orbit

An explorable space portfolio built with Next.js 15, React 19, TypeScript, and Three.js. A cinematic overview leads to an interactive rocket journey and a directly accessible project collection.

## Development

```sh
npm ci
npm run dev
```

## Checks

```sh
npm run typecheck
npm test
npm run build
```

## Visitor experience

- Fly with WASD / arrows; Shift boosts. Click / tap a planet or use the destination menu for autopilot.
- E expands the nearby holographic panel, M opens the orbit map, Escape closes overlays.
- Select a satellite to navigate to its project. Browsing the HTML project collection requires no 3D controls.
- Low, Normal, and Ultra change resolution caps, visible particle counts, asteroid instances, shader detail, and bloom. The choice persists locally.
- Dark / light appearance and reduced motion are supported. Ambient audio starts only after an explicit click.
- Rendering pauses outside the scene viewport and when the tab is hidden. Without WebGL, a textured destination view keeps planet menus, skill panels, the orbit map, and project details usable.

## Content

Update `lib/portfolio.ts` for destinations, counts, project descriptions, and contacts. Counts are supplied by the portfolio owner and refer to total contributions. Additional client projects use aliases and are marked visibly as such. Project visuals are original identity artwork, not screenshots of production products.

## Assets & references

Earth day, night, and cloud textures are from the Three.js planet examples, originally credited to NASA. Three.js is MIT licensed. Instrument Serif is distributed under SIL OFL via @fontsource. Geist is distributed under SIL OFL.

Interaction inspiration: Bruno Simon's explorable portfolio. Visual references: the owner's supplied Pinterest examples and anime holographic panel references. The rocket, satellites, station, planets, shaders, and UI were built specifically for this portfolio.

This rebuild starts from the existing live `agent/typography-refresh` revision of KiZakiXD/Porto and keeps the existing Vercel project and domains.
