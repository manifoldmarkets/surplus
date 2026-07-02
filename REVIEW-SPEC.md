Create a review system for applications to Surplus, starting from the current Airtable base.

Key features:
- CRM-like, make it easy to view applications (eg list, kanban) + sort applications (eg by rating, time). But most importantly keep it flexible to further vibecoded changes.
- Should be good for reviewing (reading the applications quickly, then a bit more, and then all details)
- Right now, just expose a way to write to the "Austin's Notes" section, which directly writes to Airtable
- Also, set up a bit of scaffolding so that there's an AI review pipeline, which lets me pick a model and configure a prompt and see how it grades a bunch of applications
- I also want a way to configure + preview a batch email to all applicants, mostly to send them a copy of their responses. (A bit like Airtable's Automations UI perhaps, with draft/preview/send?)
- For now, host this all on surplus.dev/review (and sub-urls as appropriate)

Notes:
- You'll want to hook into and investigate the Airtable for all Surplus applications; API key in env.
- Probably openrouter for choosing between models, API key in env
- Probably resend for the email? I haven't used it before but it seems recommended
- If you need a backend-as-a-service, try instantdb (app id fb98d9c6-b4a0-4ecb-935d-4cd969c873d6). But mostly keep Airtable as source of truth for now.
- For now, simple auth, password protect it with the env variable. (After the first time the admin logs in, store to local cache to skip future logins). We'll probably do fancier auth later.
- Style-wise: this is more of an admin dashboard, so keep it simple; perhaps use a few colors and fonts from the landing page but don't go overboard

Things I'll probably want eventually, but don't worry about in this coding pass:
- Something like an agentic/claude code-like system built into the dashboard which I can converse with eg "who should Alice consider cofounding with?", "build me an artifact to visualize founders by idea cluster"
- Ability to share the chosen startups, first for each other & funders, eventually in public as eg "who's in batch 1", "other great opportunities"
  - In general the more we can put in public the better, "build-in-public" ethos. But I want to balance against some people not expecting to have their applications publicly hosted (at least for this first batch), and a bit of weirdness around doing public ratings. Probably I'll ask the selected applicants to opt into it for this round, and also offer to any other applicants who we rated as pretty good and who want to be referred to other funders.

---
BTW, here's a prompt for first-pass grading that I used in Airtable with Opus 4.8. Consider the prompt as imperfect, it was vibed in a few min, but perhaps still useful to reference:

You are screening applications for Surplus — a 3-month San Francisco incubator
that funds software founders building massive public good in the age of
transformative AI ($100k on a SAFE at a $2m cap, ~10-founder cohort, run by
Austin of Manifund & Mox). Rate how excited Surplus should be about this applicant,
1–5.

WHAT SURPLUS FUNDS — three core categories (adjacent is fine):
1. AI for epistemics & coordination — LLM tools that help people think better,
  coordinate, and build common knowledge (fact-checking, forecasting, research
  reports, digital twins, dispute resolution).
2. Public-facing websites — translating AI-safety / important concepts for a wide
  audience with design and an eye for virality (microsites, visualizations,
  explainers, demos, games, courses).
3. Community infra — marketplaces / platforms for EA, AI-safety, and x-risk work
  (jobs, funding, writing, events).

JUDGE ON THREE AXES:
- Idea: in-scope? Original, crisp, and load-bearing — or generic / slop? Is
 software actually the right tool? Could this become a real product with users?
- Founder: legible track record of shipping and doing hard things. EA /
 AI-safety / rationalist nativeness is a strong plus. Evidence they can build
 AND distribute (taste, design, marketing — not just code). A strong "most
 impactful project" and real links/portfolio count; a hand-wavy or empty founder
 section counts against.
- Fit with Surplus & Austin: cares about x-risk and flourishing futures;
 for-profit-amenable; writes with earnestness and craft, not LLM boilerplate.

CALIBRATION — match this bar. Be willing to be harsh; most applicants are 2–3,
and 5 is rare:
- 5 -- Successful exited founder looking for their next project
- 4 — Respected, EA-native builder with a fuzzy or early idea ("not sure yet")
 but obvious ability to ship. Founder quality carries it.
- 4 — Strong founder (e.g. ex-METR, ex-OWID, serious dataviz PhD) with a crisp,
 clearly in-scope idea. Would interview.
- 3 — Good founder and worthy cause, but something caps it: a somewhat generic
 idea ("a better fact-checker"), or hard insistence on nonprofit, or a fuzzy
 idea paired with a less-proven founder. Worth a follow-up question.
- 2 — Earnest but orthogonal to scope (e.g. a personal-meaning or wellness app
 dressed in EA language), verbose and hedged rather than sharp, weak
 distribution story.
- 1 — Slop, incoherent, or no real public-good / AI-safety nexus; out of scope.

RUBRIC:
1 = bad, slop, out of scope
2 = meh, some redeeming qualities, but pass
3 = okay — might send follow-up questions or interview a few
4 = good — progress to a 15-min interview
5 = fantastic — happy to fund on the spot

OUTPUT: ≤100 words of reasoning (shorter is
better). Lead with the single biggest driver of the score, then name the
strongest and weakest signal. Be specific to THIS applicant — do not restate the
rubric. End with a single integer from 1-5, in brackets, eg [4]

APPLICATION:
Name: 
Personal link: 
Idea (short): 
Idea (long): 
Why this idea: 
Most impactful project: 
Users & acquisition: 
Revenue model: 
Other interests: 
Idea link: 