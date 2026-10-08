# Orbital Works verification

Verified on 8 October 2026 against the production Next.js build served with `next start`.

## Build and navigation

- `npm run build`: passes, including TypeScript checking and static generation of all routes and the Open Graph image.
- `npm run test:orbit`: passes 3,286 spherical navigation steps, longitude seam crossings, polar routes, antipodes, arrival, keyboard limits, and camera-relative satellite occlusion.
- `npm run typecheck` and `git diff --check`: pass.
- Initial route JavaScript: 113 kB; Quick View: 110 kB. Three.js and the scene are loaded separately through a dynamic client import.

## Browser flows

Chromium with WebGL software rendering; desktop 1440×900, touch portrait 390×844 and 320×568, and landscape 844×390:

- The full-detail planet renders; all four systems expose their matching project or contributor records.
- WASD and arrow keys move the probe. Satellite selection flies along a spherical path and opens the selected record on arrival.
- Animated camera follow reaches a project with normal motion enabled; dragging the camera does not accidentally inspect a satellite.
- E opens the nearby record; inspection updates scan progress. Returning to overview cancels active flight.
- Modal dialogs pause flight, make the underlying interface inert, trap keyboard focus, close with Escape, and restore access to the interface.
- Mobile taps approach and inspect a visible satellite. The compact destination control reaches another project and the MiMo AI contributor record.
- Entry actions remain visible at small portrait and landscape sizes without horizontal overflow.
- Reduced motion follows the browser preference. Low-power settings and keyboard dismissal work.
- The NextFly date is labeled Development record, not founding or launch date.
- Quick View contains the same eight project records, with four explicit Concept labels, and the preserved relationship context for all five organizations.
- Forced WebGL failure retains a working Quick View link. Quick View renders complete project, relationship, and contact information with JavaScript disabled.
- No page or console errors occurred during these flows.

Rendered screenshots were inspected on desktop and mobile. Review led to smoother matte planet normals, smaller on-demand satellite labels, neutral text colors, touch target sizing, and short-screen layout adjustments. Software rendering verifies behavior and layout; these checks do not claim a hardware frame-rate benchmark.

## Deployment scope

Publish this implementation only to the preview branch `agent/developer-archive-3d` in Vercel project `porto`. The existing production source branch `agent/typography-refresh` is preserved. Preview access remains subject to the project's existing Vercel authentication settings.
