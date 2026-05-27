# Surplus Landing Page

_Started 2026-05-27 21:19 UTC_

---

## User

Build a landing page for "Surplus," a software incubator for AI safety and public good projects. 

Design direction: 1970s political broadside
meets contemporary risograph print.

As much as possible, use the copy written in the attached markdown file; avoid adding in your own LLM-ese

## Assistant

_[tool: read_file]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: set_project_title]_

_[tool: update_todos]_

I've got the copy and the visual direction. Committing to a clear aesthetic before writing:

**Design system**
- 1970s broadside × contemporary riso: cream paper, three-ink palette (Federal Blue, Fluorescent Pink, Highlighter Yellow) + near-black ink, halftone dots, slight misregistration, paper grain
- Type pairing: **Bowlby One** (wood-type slab) for masthead/numerals, **Antonio** condensed gothic for headlines, **Newsreader** serif for body, **JetBrains Mono** for dates/labels
- Decorative motifs: rules, asterisks, pointing hands (☞), halftone blobs, registration marks, wax-seal CTA
- Long-scroll broadsheet layout with multi-column zones, ornamental dividers, numbered categories
- Tweaks panel: palette switcher, halftone density, grain toggle

Let me also rename and set up assets.

_[tool: write_file]_

## Assistant

_[tool: read_file]_

_[tool: copy_starter_component]_

_[tool: write_file]_

Now the main HTML file with all the copy:

_[tool: write_file]_

_[tool: write_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

I need to fix the Tweaks — `TweakColor` stores the palette array as the value, but I need the palette name (string) since it drives a `data-palette` attribute. Let me use `TweakSelect` with palette names plus a custom swatch row.

_[tool: grep]_

_[tool: read_file]_

Good — TweakSelect supports `{value, label}` objects. Now I need to fix `title→label` on TweakSection and `format→unit` (or omit) on TweakSlider, and add the PaletteSwatches component.

_[tool: write_file]_

_[tool: done]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

I see a few rendering issues to fix: the manifesto banner wraps and breaks visually, `$100K` overflows its column in the factstack, and the eyebrow row is crowded. Let me tighten those.

_[tool: str_replace_edit]_

Several rendering issues to address:
1. Responsive breakpoint kicking in at the preview width (collapsing the 3-col grid)
2. Banner text wrapping and losing its dark background
3. `$100K` overflowing factstack column
4. Eyebrow pill row crowded

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

Several layout issues at preview width. Let me fix:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

Now I need to update the HTML to wrap lab+val in a `.meta` div in the factstack and remove the `<br/>` from cat titles:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: grep]_

The factstack `.meta` flex isn't taking. Let me check by force-cache-busting and also tighten the timeline sub rows:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

Excellent — the actual rendering is much better than the html-to-image previews suggested! Let me check the rest of the page in the user's view:

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

_[tool: str_replace_edit]_

_[tool: done]_

The layout works correctly in the actual browser (the html-to-image preview was misleading). Let me do a final pass and hand off.

_[tool: fork_verifier_agent]_

The landing page is live at **Surplus Broadside.html**.

**Design system**
- Cream paper · 3-ink riso palette (Federal Blue · Fluorescent Pink · Highlighter Yellow) · halftone dots · misregistered offsets · paper grain
- Type pairing: **Bowlby One** wood-type slab (mastheads/numerals) · **Antonio** condensed gothic (section heads) · **Newsreader** serif (body) · **JetBrains Mono** (dates/meta)

**Structure**
1. Masthead — Vol. I, No. 1 with dateline stripe and dark deadline band
2. Hero — massive SURPLUS wordmark with riso offset, eyebrow pills, factstack ($100K / 12 weeks / 2 venues / Demo Day), wax-seal APPLY stamp
3. Manifesto — dark banner, left/right glosses, drop-capped body using your copy
4. **§01** Projects We're Excited For — three category cards with halftone/stripe/dot decorations and bulleted examples
5. **§02** What We Offer — asymmetric 6-cell offer grid (capital, cohort, office hours, place, demo day, speakers)
6. **§03** Timeline — May 29 → Sep 18 with inline LessOnline / Manifest sub-rows
7. **§04** FAQ — four Q&As in 2-column reading style
8. CTA — "SHOVELS, WAITING TO BE SOLD." dark band with offset Apply button
9. Colophon

**Tweaks** (toolbar toggle): palette switcher (Pink×Blue, Red×Blue, Green×Pink, single-ink black) · halftone density slider · misregistration slider · paper grain toggle.

**Caveats / next steps**
- The Apply button is a placeholder — point it at the Airtable URL when ready
- Speaker list, demo-day date, and venue split are pulled verbatim; let me know if any details have shifted since the draft
- For a printed broadside, ask me to swap to CMYK-safe colors and add bleed/crop marks

## User

Some changes:
- Cut the very first top bar "(Vol. I"...)
- Cut "1 demo day", add "12-20 founders"
- Change the bottom shoutout from Shovels,... to "Code for massive public good"

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

Done. Changes applied:

- Cut the masthead's "Vol. I, No. 1 / Public Notice / Berkeley·SF·Internet" top bar
- Replaced the factstack's "1 Demo Day" row with "12–20 Founders in the cohort"
- Swapped the closing call from **"SHOVELS, WAITING TO BE SOLD."** to **"CODE FOR MASSIVE PUBLIC GOOD."**

## User

Save as standalone HTML: Surplus Broadside.html

## Assistant

_[tool: snip]_

_[tool: copy_files]_

_[tool: str_replace_edit]_

_[tool: super_inline_html]_

_[tool: run_script]_

The bundler choked on a `url(%23n)` (URL-encoded `#n`) inside the inline-SVG data URI for the paper grain. Let me convert that SVG to base64 to keep the bundler out of it:

_[tool: str_replace_edit]_

_[tool: super_inline_html]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

Clean. Delivering:

_[tool: present_fs_item_for_download]_

Bundled into a single self-contained file — fonts, styles, and the Tweaks runtime are all inlined. Works offline; just open in any browser.

