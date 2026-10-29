# CASA Förderverein e.V.

A new, independent German website using the approved Zwischenraum identity.
The original user copy, approved branding kit and project brief are preserved here.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3016. Node.js 20.9 or newer is required by Next.js.
For a production preview, run `npm run build` and then `npm run start`.

## Stack

The public frontend follows CASA's current versions: Next.js 16.4.3 App Router,
React 19.2.4, TypeScript, Tailwind CSS 4, ESLint and Playwright. The site uses
Server Components with small client islands for navigation and scroll reveals.
Manrope is served locally. No database or credentials are needed.

## Source and direction

- [Editorial source](docs/source-copy.md): the full text supplied in this chat.
- [Project brief](docs/PROJECT-BRIEF.md): concept, content boundaries and launch needs.
- [Branding kit](docs/branding/kit/START-HERE.txt): logo, guide, print/digital material and fonts.
- `public/brand/logo.png` is the approved raster artwork, placed unchanged.
- The curves and square form a native vector graphic language around that artwork.

The homepage covers the association, access to learning, planned B1 preparation
and scholarships, the school's meeting spaces and individual learning support.
The information-card download is a real PDF from the kit.

## Verification — 2026-10-29

- `npm run build`: passed; homepage, icon and robots routes prerendered.
- `npm run lint`: passed without warnings after the config correction.
- `npm run typecheck`: passed.
- `npm run test:e2e`: passed, 22 checks using Playwright CLI.
- `npm test`: runs the same browser verification suite; there is no separate unit suite.
- Browser checks cover 320, 390, 768, 1024, 1440 and 1920 px widths, hero overlap,
  menu opening/Escape/anchor navigation, planned-programme labels, real PDF downloads,
  reduced motion and core content without JavaScript.
- Desktop and mobile visual review completed. Screenshots and machine-readable
  results are in the ignored `output/playwright/` directory.

Tests use an isolated browser session. Google Chrome must be available locally.
They reuse a running preview on port 3016 or start a built preview for the checks.

## Publication state

This is a local preview, with `noindex` metadata and a robots exclusion. Association
contact, imprint and privacy information must be verified before public launch.
There are no donation, application or contact forms and no invented contact details.
No hosting, domain or GitHub configuration has been created.

## Codex organization

The user requested a new project and transfer of the existing design chat
`01a1891b-9be8-7d30-abe8-aca0b9989b28`. The new folder is:

`/Users/rahmanshafiee/Code/local/casa-foerderverein`

The user added this folder to Codex. Registered project ID:
`fdff1abc-2987-43b1-be7e-60edce9e7e28` (`casa-foerderverein`).
The tool attempted to move the original chat and returned `confirmation_required`
because it has the original CASA school folder as an additional source. Codex
requires the user to move this chat through the sidebar to approve that access.
Computer control of Codex itself is also blocked. Preserve this chat rather
than creating another one; verify its project membership after the sidebar move.

The older Vite project at `/Users/rahmanshafiee/Documents/CASA Verein` and the
CASA school repository were not modified.
