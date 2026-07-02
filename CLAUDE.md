# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Always use **bun** (never npm) — the lockfile is `bun.lock`.

- `bun run dev` — start the dev server (Next.js + Turbopack) at localhost:3000
- `bun run build` — production build; also runs `tsc` typechecking. Use this to verify changes compile.
- `bun run lint` — ESLint. Note: files under `design/` have pre-existing lint errors; ignore those.
- `bun run start` — serve the production build
- `bun install` — install dependencies

There are no tests.

## Architecture

A Next.js 16 (App Router) site for **Surplus**, a software incubator: a single-page marketing site at `/`, plus a password-gated admin dashboard at `/review`. Deployed on **Vercel** (project `manifund/surplus`) — pushes to `main` ship to production.

- **`app/page.tsx`** — the entire landing page as one server component. All copy and layout live inline here (masthead, hero, manifesto, projects, offers, timeline, FAQ, CTA, footer). `README.md` is the canonical source for the site's *content* (dates, dollar amounts, project examples, FAQ answers) — keep them in sync.
- **`app/layout.tsx`** — root layout; loads four Google fonts as CSS variables.
- **`app/welcome-popup.tsx`** — a first-visit "this is a mockup" modal (`"use client"`) gated by `localStorage`. Currently disabled (not mounted anywhere); re-enable by rendering `<WelcomePopup />` in the layout.
- **`app/globals.css`** — Tailwind v4 setup. Design tokens (colors, fonts, the `820px` `bp` breakpoint) live in the `@theme` block; bespoke print effects (`misreg*` text-shadows, `halftone` dot field, paper grain) are `@utility`/`@layer base` rules.

### Review dashboard (`/review`)

An internal tool for reviewing Surplus applications. **Airtable is the source of truth** (base `appaxqJfxht7OronH`, table `Applicant`); nothing is stored locally except localStorage drafts.

- **`lib/review/fields.ts`** — Airtable field-ID map, the normalized `Applicant` type, and `applicationText()`. Add new Airtable fields here first; everything else derives from it.
- **`lib/review/airtable.ts`** — REST client (list/get/update records, create fields via the Meta API). Gotcha: on writes, `returnFieldsByFieldId` goes in the JSON body, not the query string.
- **`lib/review/auth.ts`** + **`proxy.ts`** — shared-password auth against `REVIEW_PASSWORD`. The cookie holds a salted SHA-256 of the password; the salt string is duplicated in both files — keep in sync. `proxy.ts` (Next 16's rename of middleware) guards `/review/*` and `/api/review/*`; API routes also re-check via `requireAuth()`.
- **`app/review/`** — pages: list/kanban (`applicants-view.tsx`), detail with autosaving notes (`app/[id]/`), AI grading (`ai/`), batch email (`email/`). Shared widgets in `ui.tsx`.
- **AI pipeline** — grades via OpenRouter (`OPENROUTER_API_KEY`), one API call per applicant orchestrated client-side (3 concurrent); writes `"<label> prio"`/`"<label> notes"` fields back to Airtable, auto-creating them (needs a PAT with `schema.bases:write`). Default prompt lives in `lib/review/ai.ts`.
- **Batch email** — via Resend (`RESEND_API_KEY`), plain-text with `{{merge tag}}` rendering in `lib/review/merge.ts` (shared by client preview and server send). Sender domain `manifund.org` must be verified in Resend.
- Env vars (`.env` locally, Vercel project settings in prod): `AIRTABLE_API_KEY`, `REVIEW_PASSWORD`, `OPENROUTER_API_KEY`, `RESEND_API_KEY`.

### Next.js 16 gotchas (differs from older training data)

- `middleware.ts` is now **`proxy.ts`** (root-level, Node runtime, `export function proxy`).
- `params`, `searchParams`, and `cookies()` are **async — always await them**.
- `fetch` is **uncached by default**; review pages also set `export const dynamic = "force-dynamic"` for freshness.

### Design conventions (important)

- This is a **riso/broadside print** aesthetic — paper texture, off-register ink, halftones, three "ink" colors. Match it when adding UI. The `/review` dashboard uses a toned-down version (same tokens/fonts, minimal effects) — keep it utilitarian there.
- **Styling is Tailwind-inline.** Don't add CSS to `globals.css` except bespoke print effects. Use the token utilities: `bg-paper`, `text-ink-pink/blue/yellow/dark`, `font-display/condensed/serif/mono`, and `misreg`, `halftone`.
- **Responsive uses a single max-width breakpoint:** `max-bp:` (≤820px) for the main layout, plus `max-sm:` for phone tweaks. It's max-width (desktop-first), not the usual min-width.
- The path alias `@/*` maps to the repo root.
- `/apply` redirects (via `next.config.ts`) to the live application form on Airtable; all Apply links on the page point to `/apply`.
