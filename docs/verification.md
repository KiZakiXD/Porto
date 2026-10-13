# Verification — Kinetic remake

Production Next.js build and Chromium verification performed on 13 October 2026 (Asia/Jakarta).

## Build and runtime

- Production build and TypeScript checks pass. Eight static-generation steps complete, including the new social preview.
- Page first-load JavaScript is 155 kB; the Three.js scene is a separate dynamic bundle.
- Animated draw calls advance while the scene is active. Pause stops autonomous draw calls. Scroll and controls still render on demand.
- Disassembly changes the actual canvas image while paused; the control toggles its state correctly.
- Low, Normal, and Ultra render successfully.
- Six scroll chapters and the assembly's changes in placement, scale, orientation, and separation were inspected.
- No normal-runtime or reduced-motion browser errors were observed. An initial reduced-motion hydration mismatch was corrected before completion.

## Content and interactions

- Ethereum/Robinhood shows 8 highlighted records plus 3 additional entries; Base switches to 31+ and Solana to 16.
- Logo assets load from local files. The incorrect Xiaomi home glyph from the site's header skeleton was replaced with the actual Xiaomi vector mark from Simple Icons.
- Eight highlighted rows and three additional records are available. Project dialogs open and close, Escape restores focus, and mock URL copying succeeds.
- Mock URLs are text templates rather than outbound links.
- Mobile navigation selects the requested section and closes.
- Reduced motion defaults the renderer to paused.
- Forced WebGL failure preserves the portfolio and project inspection.
- JavaScript-disabled content includes all eleven project descriptions, both ecosystem totals, and GitHub contact.

## Visual review

1440 × 960 desktop; touch layouts at 320 × 568, 390 × 844, and 768 × 1024. No horizontal overflow or mobile viewport expansion remains at these widths. Screenshot review corrected the display-face width, dialog composition, robot orientation, and text/scene separation.

Tests use software WebGL rendering to verify behavior and composition; they do not represent a measured physical-device frame-rate benchmark.

## Publication

The implementation is prepared on branch `agent/kinetic-remake` for a Vercel preview in project `porto`. Hosted access follows the project's Deployment Protection settings. Production promotion is a separate action after reviewing the preview.
