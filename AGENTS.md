# CASA Förderverein website

Read `/Users/rahmanshafiee/AGENTS.md` first. This is a new, independent website.
The older `/Users/rahmanshafiee/Documents/CASA Verein` and the CASA school repo
are references, not working directories for this project.

## Approved direction
- The user approved the light Zwischenraum identity in `docs/branding/kit`.
- Preserve the original logo artwork. Do not recreate the wordmark with a font.
- Use Manrope Light/Regular/Medium, charcoal, white/paper, cyan and small yellow accents.
- Favor open, editorial layouts, slim typography and generous whitespace.
- The source copy is `docs/source-copy.md`. Separate the association from the school.
- B1 preparation and scholarships are planned, not open programmes.
- Do not invent registration, donation, banking, contact, legal or tax details.
- No publishing, hosting, domain changes or remote Git actions without user authorization.

## Stack and checks
- CASA stack: Next.js App Router 16.4.3, React 19.2.4, TypeScript, Tailwind 4.
- Read relevant installed guides in `node_modules/next/dist/docs/` before changing Next APIs.
- Server Components by default; small client islands for menu and motion only.
- Keep the local preview noindex until launch information is verified.
- Verify with `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`.
- Explain any skipped checks and record evidence in README.
