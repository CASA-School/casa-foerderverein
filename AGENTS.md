# CASA Förderverein website

Read `/Users/rahmanshafiee/AGENTS.md` first. This is a new, independent website.
The older `/Users/rahmanshafiee/Documents/CASA Verein` and the CASA school repo
are references, not working directories for this project.

## Approved direction
- The user approved the light Zwischenraum identity in `docs/branding/kit`.
- Preserve the original logo artwork. Do not recreate the wordmark with a font.
- Use Manrope Light/Regular/Medium, charcoal, white/paper, cyan and small yellow accents.
- Favor open, editorial layouts, slim typography and generous whitespace.
- Keep navigation and footer links at least 16px and mobile body copy at least 16px.
- The user authorized local-only partnership enquiries. Keep them private in the ignored `.local/` folder; no email, calendar booking or payment integration is active.
- The source copy is `docs/source-copy.md`. Separate the association from the school.
- B1 preparation and scholarships are planned, not open programmes.
- Do not invent registration, donation, banking, contact, legal or tax details.
- On 2026-10-30 the user authorized CASA GitHub publication (public if required by Vercel Hobby), deployment in the CASA Vercel account and connection of both Hostinger domains. Keep the hosted site noindex and the hosted enquiry capture disabled until real delivery/legal details are approved. Further unrelated external changes still require authorization.

## Stack and checks
- CASA stack: Next.js App Router 16.4.3, React 19.2.4, TypeScript, Tailwind 4.
- Read relevant installed guides in `node_modules/next/dist/docs/` before changing Next APIs.
- Server Components by default; small client islands for menu and motion only.
- Keep the local preview noindex until launch information is verified.
- Verify with `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`.
- Explain any skipped checks and record evidence in README.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
