# KIZAKIXD — Beyond the Block

A new kinetic portfolio built around an original orbital assembly. A continuous Three.js scene changes position, orientation, and separation as visitors move through six chapters. Warm charcoal, bone typography, polished metal, and vermilion replace the previous interface and planet hero.

## Run

Node.js 22 LTS:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The local fonts and brand assets do not require third-party requests at runtime.

## Structure

```text
app/page.tsx                         Page entry
app/layout.tsx                       Local Syne / Geist fonts and metadata
app/globals.css                      New visual system and responsive composition
app/fonts/                           Syne ExtraBold and OFL license
components/experience/Experience.tsx  Six chapters, controls, project records
components/experience/KineticWorld.tsx Segmented geometry, camera choreography, reflection environment
public/brands/                       Authentic source artwork
public/brands/sources.json            Asset provenance and checksums
data/folio.ts                        Owner content and project records
lib/site.ts                          Public URL / contact configuration
vercel.json                          Next.js deployment configuration
```

## Experience

- Scroll changes the assembly's placement, orientation, scale, and separation. Pointer movement adds a small camera response.
- **Disassemble / Reassemble** changes the eighteen independently animated ring segments.
- **Low / Normal / Ultra** change geometry resolution, star count, antialiasing, and pixel ratio.
- Pause stops autonomous motion. Scroll and UI interactions still redraw the scene. Reduced motion defaults to pause and disables smooth page scrolling.
- Rendering stops while the document is hidden. The final work and contact chapters use demand rendering.
- The three network selectors display the owner-provided Ethereum/Robinhood, Base, and Solana records.
- Eight featured project rows and three further explorations open native dialogs with focus restoration, Escape dismissal, and copyable mock URL templates.
- WebGL failure leaves the CSS orbital illustration and functional portfolio interface. No-JavaScript visitors receive project descriptions and all ecosystem totals through a static fallback.

## Content and assets

Edit `data/folio.ts` for project content, roles, and ecosystem totals. The Xiaomi/MiMo relationship and the Base / Solana counts come from the owner brief. This implementation does not add employment dates, deployed contracts, audits, or verified affiliations.

Project destinations are deliberately labeled placeholders and rendered as copyable text. Replace them with confirmed URLs before enabling real outbound links.

Brand artwork is downloaded from official brand sources and Simple Icons, with the source of each asset recorded in `public/brands/sources.json`. MiMo is supplied as its official transparent PNG; the other marks are SVG. Xiaomi’s vector path is from Simple Icons, using Xiaomi brand orange. The artwork itself is not redrawn, distorted, recolored, or animated. The mechanical sculpture and all page compositions are original.

## Configuration

Optional public settings in `.env.local`:

```dotenv
NEXT_PUBLIC_SITE_URL=https://kizakixd.my.id
NEXT_PUBLIC_CONTACT_EMAIL=
```

Leave the contact email empty to use the GitHub profile. These variables are public display settings.

## Validate and deploy

```sh
npm run build
npm run typecheck
npm run start
```

To deploy a preview:

```sh
npx vercel login
npx vercel link
npx vercel deploy
```

Select the existing **porto** project for this repository. Dashboard settings: Next.js, repository root, Node.js 22.x, install `npm ci`, build `npm run build`. `vercel.json` supplies the framework and commands. A push to branch `agent/kinetic-remake` creates a Git preview.

Preview access follows the project's Vercel Deployment Protection settings.

After reviewing the implementation, a production deployment can be staged and promoted:

```sh
npx vercel deploy --prod --skip-domain
npx vercel promote YOUR_STAGED_DEPLOYMENT_URL
```

See `docs/verification.md` for the actual verification performed.
