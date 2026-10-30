# CASA Förderverein e.V.

A new, independent German website using the approved Zwischenraum identity.
The original user copy, approved branding kit and project brief are preserved here.

## Run locally

```sh
npm install
cp -n .env.example .env.local
npm run dev
```

Open http://127.0.0.1:3016. Node.js 20.9 or newer is required by Next.js.
For a production preview, run `npm run build` and then `npm run start`.

## Stack

The public frontend follows CASA's current versions: Next.js 16.4.3 App Router,
React 19.2.4, TypeScript, Tailwind CSS 4, ESLint and Playwright. The site uses
Server Components with small client islands for navigation and scroll reveals.
Manrope is served locally. No external database or credentials are needed for the local preview.

## Source and direction

- [Editorial source](docs/source-copy.md): the full text supplied in this chat.
- [Project brief](docs/PROJECT-BRIEF.md): concept, content boundaries and launch needs.
- [Branding kit](docs/branding/kit/START-HERE.txt): logo, guide, print/digital material and fonts.
- `public/brand/logo.png` is the approved raster artwork, placed unchanged.
- The curves and square form a native vector graphic language around that artwork.

The homepage covers the association, access to learning, planned B1 preparation
and scholarships, the school's meeting spaces and individual learning support.
The information-card download is a real PDF from the kit.

## Partnership enquiries — local preview

The user requested larger reading sizes, smoother anchor navigation, a Bremen
partnership invitation, and an interactive company/individual contact popup.
The user explicitly chose **local preview only** for delivery.

The three-step popup collects support interests, contact/organisation details,
regional connection, and a call/video/in-person meeting preference. A requested
date and time window are preferences, not confirmed calendar availability.
It validates answers, supports back navigation and keyboard use, and preserves
the answers when a request fails. The original animated logo is unchanged.

The fields have consistent hover, focus and error states, clear optional labels,
autofill hints and email feedback on blur. The region/time dropdowns use
[Radix Select](https://www.radix-ui.com/primitives/docs/components/select), with
keyboard selection, typeahead and a portal inside the native modal's top layer.
Escape closes an open dropdown before the form. Date and time controls stack on
phones, and requested dates share the server's 90-day limit. A live review shows
the chosen support topics and meeting preference. Saving locks editable controls,
announces progress and prevents duplicate submissions; failed saves retain answers.

With `CONTACT_PREVIEW_ENABLED=true` in the ignored `.env.local`, the server saves
each accepted enquiry to `.local/enquiries/<requestId>.json` with private file
permissions. Duplicate retries return the original receipt. The form states that
the information is saved locally; no email is sent and no meeting is booked.
The endpoint fails closed without the explicit preview flag. There is no public
read endpoint. This data folder is ignored by Git and excluded from server tracing.

To review saved enquiries locally:

```sh
npm run enquiries
```

This prints private contact information to the local terminal. The website does
not expose an enquiry listing. Automated checks remove only their own synthetic
fixtures and do not delete other saved enquiries.

The old project's reusable content and its verification limits are documented in
[the reference review](docs/REFERENCE-REVIEW.md). Before going live, configure
the real delivery/storage workflow and complete the legal and privacy information.
PayPal and actual calendar bookings are intentionally deferred.

## Verification — 2026-10-30

- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed.
- `npm run build`: passed without warnings, including the contact API and privacy route.
- `npm run test:e2e`: passed, **68 checks** against the production preview.
- Checks cover responsive layouts, readable type, a single sticky-header scroll
  offset, interruptible eased scrolling, reduced motion, native keyboard/focus
  behaviour, company/private-person paths, validation, failed-request recovery,
  real local persistence, duplicate retries, and PDF downloads. The expanded
  checks also cover dropdown keyboard/typeahead/Escape behaviour, menu placement
  at 320/390/768/1440px, blur validation and error focus, preserved region choices,
  review content, whitespace in names, and locked fields during a controlled save.
- An additional isolated-server check confirmed that contact capture returns 503
  when the preview flag is disabled. The API's output trace excludes `.local/`.
- Desktop partnership/footer and desktop/mobile popup screenshots were visually reviewed.
  The refined fields, mobile time dropdown and enquiry review were inspected again;
  the production browser session reported zero errors and zero warnings.
- All four required gates ran. `npm test` aliases the same browser suite; no
  separate unit framework was added. Notes-only updates did not repeat the gates.

## Initial verification — 2026-10-29

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

Deployment status and DNS rollback records are in [the deployment record](docs/DEPLOYMENT.md).
The repository is published at https://github.com/CASA-School/casa-foerderverein.
Vercel account verification is pending; domains have not yet been changed.

On 2026-10-30 the user authorized publishing this project to the CASA GitHub
organisation, deploying it to the CASA Vercel account and connecting both Hostinger
domains. The target primary address is `https://casa-foerderverein.de`;
`casa-verein.de` and the `www` variants redirect to it.

This remains a project preview with `noindex` metadata and a robots exclusion.
Association contact, imprint and complete privacy information are still needed.
On Vercel, both the contact UI and API refuse local-preview data capture even if
`CONTACT_PREVIEW_ENABLED=true` is accidentally configured. The public popup
explains that online enquiries are being prepared, without collecting answers.
The local three-step form remains available on this laptop. The public privacy
page describes the hosted preview rather than claiming it is a private local site.
There are no donations, outbound messages or calendar bookings.

Vercel should build from Git, with no `.env.local` or private enquiry records.
The optional `SITE_URL` is `https://casa-foerderverein.de`; the hosted fallback is
also that canonical address. Keep local-preview variables off in Vercel.

## Codex organization

The user requested a new project and transfer of the existing design chat
`01a1891b-9be8-7d30-abe8-aca0b9989b28`. The new folder is:

`/Users/rahmanshafiee/Code/local/casa-foerderverein`

The user added this folder to Codex. Registered project ID:
`fdff1abc-2987-43b1-be7e-60edce9e7e28` (`casa-foerderverein`).
The user completed the sidebar source-folder consent step. The app tool then
successfully moved the original chat into this project. The complete branding
and design history is preserved; no replacement chat was created. Use this
repository explicitly as the working directory, even if an older chat tool
still reports the original CASA folder as a source.

The older Vite project at `/Users/rahmanshafiee/Documents/CASA Verein` and the
CASA school repository were not modified.
