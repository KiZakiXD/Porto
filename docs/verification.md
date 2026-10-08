# Archive verification

Verified on 2026-10-08 against the production Next.js build served with `next start`.

## Automated checks

- `npm run build`: passes, including TypeScript validation and static route generation.
- `npm run test:navigation`: 11 interactable artifacts, 28 furniture/wall footprints, all six room destinations, and 354 safe route segments. Includes artifact-to-artifact routes, floor edges, square plinth corners, and invalid destinations.
- `git diff --check`: passes.

## Browser checks

Chromium with WebGL software rendering, desktop 1280×800 and mobile touch layouts at 390×844 and 320×568:

- Enter Archive mounts the world and reveals the developer character.
- WASD moves the character; E inspects nearby records; Escape closes the inspector.
- Auto-walk reaches all six rooms through connected floors.
- AI records retain Xiaomi and MiMo AI with contributor context.
- Onchain records label Base and Robinhood Chain as ecosystem work and Pons Family as team support.
- Communication Terminal exposes the existing contact links.
- Settings toggles and Escape dismissal work.
- Mobile artifact taps approach and open the matching record; destination navigation works without a joystick.
- Both mobile widths keep the entry action visible and avoid horizontal page overflow.
- Quick View renders all six selected projects and the same relationship/timeline data.
- Forced WebGL failure retains access to the complete Quick View.
- Quick View content remains available with JavaScript disabled.
- No browser page errors or console errors during these flows.

Screenshot review prompted fixes for coplanar floors, the gate occluding the player, small text, mobile label sizing, and short-screen entry layout. Software-rendered browser checks validate behavior and layout; they are not hardware performance benchmarks.
