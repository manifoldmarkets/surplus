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

A single-page Next.js 16 (App Router) marketing site for **Surplus**, a software incubator. Deployed on **Vercel** — pushes to `main` ship to production.

- **`app/page.tsx`** — the entire landing page as one server component. All copy and layout live inline here (masthead, hero, manifesto, projects, offers, timeline, FAQ, CTA, footer). `README.md` is the canonical source for the site's *content* (dates, dollar amounts, project examples, FAQ answers) — keep them in sync.
- **`app/layout.tsx`** — root layout; loads four Google fonts as CSS variables and mounts the site-wide `<WelcomePopup />`.
- **`app/welcome-popup.tsx`** — the only client component (`"use client"`); a first-visit modal gated by `localStorage`.
- **`app/globals.css`** — Tailwind v4 setup. Design tokens (colors, fonts, the `820px` `bp` breakpoint) live in the `@theme` block; bespoke print effects (`misreg*` text-shadows, `halftone` dot field, paper grain) are `@utility`/`@layer base` rules.

### Design conventions (important)

- This is a **riso/broadside print** aesthetic — paper texture, off-register ink, halftones, three "ink" colors. Match it when adding UI.
- **Styling is Tailwind-inline.** Don't add CSS to `globals.css` except bespoke print effects. Use the token utilities: `bg-paper`, `text-ink-pink/blue/yellow/dark`, `font-display/condensed/serif/mono`, and `misreg`, `halftone`.
- **Responsive uses a single max-width breakpoint:** `max-bp:` (≤820px) for the main layout, plus `max-sm:` for phone tweaks. It's max-width (desktop-first), not the usual min-width.
- The path alias `@/*` maps to the repo root.
- Path `/surplus` on manifund.org (`https://manifund.org/surplus`) is the live expression of interest form, both Apply buttons link to.
