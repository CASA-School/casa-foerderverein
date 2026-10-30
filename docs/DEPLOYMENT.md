# Deployment record — 2026-10-30

The user authorized GitHub publication, Vercel deployment and connection of both
Hostinger domains. No paid upgrade or unrelated account change was requested.

## Published source

- Repository: https://github.com/CASA-School/casa-foerderverein
- Visibility: public, for the existing CASA Vercel Hobby organisation import.
- Default branch: `main`.
- Prepared application revision: `fdf750e`.
- New commits use the CASA GitHub account's no-reply author address.
- The unrelated authenticated Vercel CLI account was not changed or used to deploy.

## Vercel target

- Account/team: CASA International Language School (`casa-international-language-school`).
- Project: `casa-foerderverein`.
- Source: CASA-School/casa-foerderverein, branch `main`, root `./`, Next.js preset.
- `SITE_URL`: `https://casa-foerderverein.de` for Production and Preview.
- No local-preview environment file or enquiry data is uploaded.
- User completed Vercel reauthentication in Chrome.
- Production deployment is Ready for Git revision `126802b`:
  https://vercel.com/casa-international-language-school/casa-foerderverein/EhqSEAPbm16vwzzyQnK11CqDyXiE
- Public Vercel URL: https://casa-foerderverein.vercel.app
- Primary site loads successfully at https://casa-foerderverein.de.
- The secondary apex redirects to the primary site over HTTPS.

## Domain plan and original records

Primary: `casa-foerderverein.de`. Redirect `casa-verein.de` and both `www` names
to that primary address. Keep the existing Hostinger nameservers. Use the exact
project-specific DNS values provided by Vercel after a successful deployment.

Hostinger's DNS UI showed only these website records before any change:

| Domain | Type | Name | Original content | TTL |
| --- | --- | --- | --- | --- |
| casa-foerderverein.de | A | @ | 2.57.91.91 | 50 |
| casa-foerderverein.de | CNAME | www | casa-foerderverein.de | 300 |
| casa-verein.de | A | @ | 2.57.91.91 | 50 |
| casa-verein.de | CNAME | www | casa-verein.de | 300 |

## Applied DNS records

Values were copied from this project's Vercel Domains screen, not a fixed example.
All four website records were updated and confirmed against the authoritative
Hostinger nameservers. Existing nameservers and all unrelated settings remain.

| Domain | Type | Name | Applied content | TTL |
| --- | --- | --- | --- | --- |
| casa-foerderverein.de | A | @ | 216.198.79.1 | 300 |
| casa-foerderverein.de | CNAME | www | db413181533efeb2.vercel-dns-017.com | 300 |
| casa-verein.de | A | @ | 216.198.79.1 | 300 |
| casa-verein.de | CNAME | www | db413181533efeb2.vercel-dns-017.com | 300 |

Hostinger now validates edited TTLs as 60–86400 seconds, so the old 50-second A
record TTL could not be retained. Both A records use 300 seconds. The www CNAME
TTLs were already 300. No paid Hostinger hosting or Vercel upgrade was added.

Vercel has a Production alias for `casa-foerderverein.de`. The other three custom
hostnames are configured as 308 permanent redirects to it. Vercel confirms Valid Configuration for all four custom
hostnames. Browser visits verified HTTPS and the primary page at the apex, plus
successful redirects from both www names and the secondary apex.

For rollback, restore the original A and CNAME contents in the table above using
a supported TTL, and adjust the Vercel aliases if the application destination changes.

## Verified application behaviour

- Lint, typecheck and local production build pass.
- Full local browser/API suite passes: 68 checks.
- Hosted-mode build passes with `VERCEL=1`, including when the local capture flag
  is deliberately true. The public contact UI has no data-entry fields and shows
  a preparation notice; the API returns 503 rather than writing to disk.
- The traced API files exclude private `.local/` data.
- Git history and tracked files were checked for credential patterns; none matched.
- `.env.local`, `.local/`, `.vercel/`, generated output and browser evidence are ignored.

The site remains a noindex project preview. Contact delivery, imprint and complete
privacy details are not ready; do not enable public enquiry capture or indexing.

## Completion evidence

- Vercel production deployment reported Ready and the GitHub `Vercel` status succeeded.
- All four Hostinger records match their authoritative DNS responses.
- A logged-out in-app browser loaded the site on the primary domain.
- Browser visits to `casa-verein.de`, `www.casa-verein.de` and
  `www.casa-foerderverein.de` all landed on `https://casa-foerderverein.de/` with
  the expected site title and no certificate interstitial.
- Public contact popup shows the preparation notice without data-entry fields.
- Live DOM metadata confirms `noindex, nofollow`, the canonical-domain social
  banner URL, and a loaded original logo.
- Screenshots are saved privately under ignored `output/playwright/`:
  `vercel-domains-live.jpg` and `casa-foerderverein-live.jpg`.

Future pushes to `main` use the existing Vercel Git integration. Changes to
application code should pass the four local gates before pushing. Documentation
updates do not require rerunning unchanged application checks.
