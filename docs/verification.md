# Verification — Galaxy rebuild

Verified with the production Next.js build and Chromium on 9 October 2026 (Asia/Jakarta).

## Build

- `npm run build` passed TypeScript validation and all eight static-generation steps, including the social preview image.
- `npm run typecheck` and `git diff --check` passed.
- First-load page JavaScript is 115 kB. Three.js loads as a separate dynamic scene bundle.

## Browser verification

Desktop 1440 × 960; touch devices at 390 × 844, 320 × 568, and 768 × 1024:

- Mars renders; selecting Jupiter switches the featured material and label.
- Pointer drag changes the planet orientation while interaction mode is active.
- Low-detail settings work without removing page content.
- MiMo collaboration copy and all three roles are visible.
- Eight featured projects render. All six category filters return the correct records.
- Project dossiers open, close with Escape, and return keyboard focus to the invoking card.
- Mock link strings are marked as placeholders and are not outbound links. Copying a template succeeds.
- The additional-project disclosure exposes exactly three records; their dossiers open correctly.
- Base and Solana counters reach 31+ and 16. Normal-motion counters animate to their targets.
- The default contact link reaches the configured GitHub profile.
- Mobile navigation opens, selects an anchor, and closes. Mobile project dialogs and their close controls work.
- No horizontal page overflow appears at the tested widths.
- Forced WebGL failure leaves the CSS scene visible and project dossiers functional.
- With JavaScript disabled, project summaries, collaboration, ecosystem figures, and contact content are server rendered.
- No browser page errors or console errors were observed.

## Animation and rendering behavior

An instrumented WebGL context verified that draw calls advance while the hero is visible and animated, stop after Pause, and stop when the scene moves outside the viewport. Reduced-motion preference was tested separately. Software rendering validates behavior and composition; these checks do not claim a physical-device frame-rate benchmark.

Screenshot review resulted in a warmer Mars material, improved tablet composition, clearer planet labels, and an in-panel mobile close control.

## Deployment

This branch is a preview implementation. `vercel.json`, `.env.example`, and README deployment commands are included. Production promotion is a separate explicit action after preview review. Project URLs remain mock destinations, as requested in the brief.
