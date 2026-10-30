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
- Import submitted; account reauthentication is required before Vercel proceeds.
  A verification code was requested to the account's CASA mailbox. The user was
  asked to complete verification in Chrome. Deployment is not yet confirmed.

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

No DNS changes have been made yet. Preserve any other records that appear later;
change only the website records required for this project.

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
