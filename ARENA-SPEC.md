# Arena: pairwise LLM ranking of applications

Replace (well, complement) the 1–5 absolute grading with pairwise comparisons + Bradley-Terry,
on the current ~200 applications. Absolute scores bunch up at 2–3 and drift with prompt wording;
pairwise judgments are the thing LLMs are actually decent at, and BT turns them into a full ranking.

## The comparison call

- One OpenRouter call per pair (Sonnet default, model picker like `/review/ai` so we can try
  an ensemble later). Cheaper/faster judges (Haiku 4.5, Gemini Flash, Cerebras-hosted open
  models) cut cost ~4× but add noise — and at 20 comparisons/applicant, each flipped verdict
  is 5% of an applicant's signal, so judge quality matters more than TPS here.
  Prompt = the existing Surplus context/axes from `lib/review/ai.ts`, but
  instead of a 1–5 rubric: "Which applicant should Surplus be more excited to interview?
  ≤80 words of reasoning, then `[A]` or `[B]`."
- Each applicant rendered with the full `applicationText()` (same input as absolute grading).
  ~4–5k input tokens/pair → **~$0.02/comparison** at Sonnet pricing.
- Position bias: randomize which applicant is A vs B per pair (cheap), rather than running
  both orderings (2× cost). Refusals/unparseable outputs get retried once, then dropped.
- Explicitly disable/cap reasoning via OpenRouter params — a judge call is ~150 output
  tokens; a model silently thinking for thousands of tokens turns 5s calls into 30s+ ones.

## Sampling: sparse, not n²

Full round-robin is 19,900 pairs (~$400) and mostly redundant — BT only needs a connected
comparison graph. **v1: ~20 comparisons per applicant ≈ 2,000 pairs ≈ $40**, built as 20 rounds
of random perfect matchings (guarantees exactly 20/each + connectivity, no duplicate pairs).
Comparisons are append-only, so we can always buy more resolution later. A **swiss** pairing
option runs rounds sequentially instead: refit BT after each round, then pair neighbors by
current score (avoiding rematches) — comparisons concentrate on close matchups, where a
verdict carries the most information. Round 1 with no history degenerates to random.

Runtime: each call is ~4–6s (sub-second prefill of ~5k tokens + ~150 output tokens at
60–80 TPS + TTFT/queue) — TPS is not the bottleneck, so ultra-fast hosts (Cerebras/Groq)
barely help. Concurrency is the lever: the 3-concurrent default inherited from `/review/ai`
would take ~55 min; **run at ~25 concurrent with exponential backoff on 429 → ~7 min**.
Going to 100 is possible (browsers multiplex fine, OpenRouter limits are credit-based) but
only saves ~5 min while making retry handling messier. Anthropic's Batch API (50% off) is
async up to 24h — incompatible with watching results stream in.

## Bradley-Terry fit

- P(i beats j) = σ(θᵢ − θⱼ). Fit client-side in plain TS (~200 params, simple MM/gradient
  iterations, converges in ms). Light L2 regularization so undefeated applicants stay finite.
- Refit incrementally as results stream in — this is what makes the future realtime viz free.
- Report as: BT score, rank, and W-L record per applicant.

## Storage

**InstantDB only — no Airtable writes for now.**

- Every comparison appends to InstantDB `arenaComparisons` (applicant record ids, order shown,
  winner, reasoning, model, token usage/cost, createdAt) — same pattern as `pangramResults`.
  Raw comparisons are the durable asset; scores are derived and cheap to recompute.
- No separate scores table (simplification from the original draft): the page fetches all
  comparisons on load and refits BT client-side in milliseconds, so standings survive reloads
  by construction. Airtable write-back can come later if the rankings earn it.

## Page: `/arena`

Simple v1, toned-down dashboard style like the rest of `/review`:

- Config strip: model picker, comparisons-per-applicant, concurrency, prompt textarea
  (localStorage draft).
- **Cost estimate widget**: before a run, build the real pairwise prompt from two actual
  applications and fire 1–2 probe calls with OpenRouter's `usage: {include: true}`, which
  returns measured token counts and dollar cost per call. Display `cost/call × planned pairs`
  (and implied wall time at the chosen concurrency). Measured beats estimated — token counts
  are model-specific and char/4 heuristics drift.
- Run button + progress (n/2,000, running cost from actual usage, errors).
- Results table: rank, name, BT score, W-L, link to applicant detail. Sortable; updates live
  as comparisons land (since BT refits incrementally anyway).
- Auth: extend `proxy.ts` matcher to guard `/arena`; API routes live under `/api/review/arena/*`
  so they inherit the existing `requireAuth()` path.

## Later, not now

- **Realtime viz**: the fun version — applicants as dots/rows visibly sorting themselves as
  comparisons stream in (rank-flow or bubble sort animation). The incremental-refit
  architecture above is designed so this is just a rendering layer.
- Ensemble: run the same sparse graph under 2–3 models, either pooling comparisons into one
  BT fit or comparing per-model rankings.
- Validation against human scores (Spearman vs Austin/Carol prios, top-K agreement) — v1 is
  eyeball-only.
- Richer inputs: fetch + summarize applicants' links before comparing.
