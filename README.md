# KIZAKIXD — Engineering New Worlds

A complete, independently rebuilt portfolio based on the new Space / Galaxy brief. A cinematic Mars/Jupiter scene leads into Xiaomi–MiMo AI, eight highlighted projects, three additional projects, Base and Solana counters, capabilities, and contact.

## Stack

Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Three.js through React Three Fiber, local Geist fonts, and Lucide icons. Animation uses the Three.js frame loop and CSS transitions. Planet surfaces are procedural shaders with no external model or texture downloads.

## Structure

```text
app/
  page.tsx                 Page entry
  layout.tsx               Fonts, metadata, viewport
  globals.css              Visual system and responsive layouts
  error.tsx                Page-level recovery
  icon.svg                 Site mark
  opengraph-image.tsx       Generated social preview
  robots.ts, sitemap.ts    Search metadata
components/galaxy/
  GalaxyPortfolio.tsx      Sections, filters, counters, accessible dialogs
  SpaceScene.tsx           Planet shaders, stars, rotation, motion control
  Marks.tsx                UI and project symbols
data/portfolio.ts          Current content and mock URL templates
lib/site.ts                Public URL and contact configuration
vercel.json                Framework and build settings
```

## 1. Run locally

Use Node.js 22 LTS or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. No environment variables are required. The default contact destination is the GitHub profile; set a public contact email to use email instead.

## 2. Configure content

Edit `.env.local`:

```dotenv
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_CONTACT_EMAIL=
```

These are public presentation settings, not secrets. Keep the email empty for GitHub contact. Add an address only when it should be publicly visible.

Edit `data/portfolio.ts` for project copy, collaboration wording, counters, and categories. The 31+ and 16 counts and Xiaomi/MiMo relationship come from the current owner brief. Mock URLs are clearly labeled, non-navigable strings; they are not asserted to be published repositories or live products. See `docs/content-notes.md` before activating them.

## 3. Validate

```sh
npm run build
npm run typecheck
npm run start
```

Visit the production build at `http://localhost:3000`. Verify filters, project dialogs, the three additional records, mobile navigation, both planet options, and contact configuration.

## 4. Deploy a Vercel preview

`vercel.json` selects Next.js, `npm ci`, and `npm run build`. No output-directory override is needed.

Dashboard workflow:

1. Import this repository, or open its existing Vercel project.
2. Select branch `agent/galaxy-portfolio-rebuild` for the preview.
3. Use the repository root as Root Directory and Node.js 22.x.
4. Add the two public environment values for the desired Preview / Production environments.
5. Deploy and inspect the preview URL.

CLI workflow:

```sh
npx vercel login
npx vercel link
npx vercel deploy
```

For this repository, select the existing `porto` project in the intended account. For a separate copy, select the project that should receive that copy. Do not commit `.vercel/` or authentication files.

## 5. Release to production

After reviewing the preview and replacing content or links that should not remain placeholders:

```sh
npx vercel deploy --prod --skip-domain
```

Test the staged production URL, then promote that exact deployment:

```sh
npx vercel promote YOUR_STAGED_DEPLOYMENT_URL
```

Alternatively, merge the reviewed implementation into the project's configured production branch and let Vercel Git integration deploy it. A preview does not automatically replace the production domain.

## Runtime and accessibility

- Enable **Drag to explore** to rotate the featured planet. Mars and Jupiter have separate procedural surface materials.
- Motion follows the operating-system preference and can be paused. Canvas rendering stops outside the hero or when the tab is hidden.
- Low detail reduces geometry, shader complexity, stars, and pixel ratio.
- WebGL failure leaves a CSS planet illustration and all portfolio sections accessible.
- Content is server rendered. Interactive 3D, filters, and dossiers enhance the page after hydration.
- Native dialogs provide focus handling and Escape dismissal. Mock destinations can be copied without visiting them.
- Contact uses email or GitHub; no form pretends to send messages.

See `docs/verification.md` for the checks performed.
