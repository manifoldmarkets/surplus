// Arena pairwise-comparison pipeline shared by the /arena page (client) and
// the compare API route (server): default prompt, verdict parsing, the
// Bradley-Terry fit, and the sparse comparison schedule. See ARENA-SPEC.md.

export const DEFAULT_ARENA_MODEL = "anthropic/claude-sonnet-5";

// {{APPLICATION_A}} / {{APPLICATION_B}} are replaced with the two applicants'
// responses at comparison time. Which applicant is shown as A is randomized
// per pair (position-bias mitigation), so the prompt never needs both orders.
export const DEFAULT_ARENA_PROMPT = `You are screening applications for Surplus — a 3-month San Francisco incubator
that funds software founders building massive public good in the age of
transformative AI ($100k on a SAFE at a $2m cap, ~10-founder cohort, run by
Austin of Manifund & Mox).

Below are two applications, A and B. Decide which applicant Surplus should be
MORE excited to interview.

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
 for-profit-amenable; writes with earnestness and craft, not LLM boilerplate.

OUTPUT: ≤80 words naming the decisive difference between these two applicants —
be specific, do not restate the rubric. Then end with your verdict as a single
bracketed letter, [A] or [B]. You must pick one, even when it's close.

APPLICATION A:
{{APPLICATION_A}}

---

APPLICATION B:
{{APPLICATION_B}}`;

// Pulls the bracketed verdict out of a completion, e.g. "... [B]".
export function parseVerdict(text: string): "A" | "B" | null {
  const matches = [...text.matchAll(/\[([AB])\]/gi)];
  if (matches.length === 0) return null;
  return matches[matches.length - 1][1].toUpperCase() as "A" | "B";
}

// Canonical unordered key for a pair, used to dedupe scheduled comparisons.
export function pairKey(x: string, y: string): string {
  return x < y ? `${x}|${y}` : `${y}|${x}`;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Builds a sparse comparison schedule: `rounds` random perfect matchings, so
// every applicant appears in exactly `rounds` comparisons (odd one out sits a
// round). Pairs already in `alreadyCompared` are repaired away by swapping
// partners within the round; the rare unrepairable duplicate is kept (extra
// data, harmless). Each pair's [A, B] display order is a coin flip.
export function buildSchedule(
  ids: string[],
  rounds: number,
  alreadyCompared: Set<string>
): [string, string][] {
  const used = new Set(alreadyCompared);
  const schedule: [string, string][] = [];
  for (let r = 0; r < rounds; r++) {
    const order = shuffle([...ids]);
    const pairs: [string, string][] = [];
    for (let i = 0; i + 1 < order.length; i += 2) {
      pairs.push([order[i], order[i + 1]]);
    }
    for (let i = 0; i < pairs.length; i++) {
      if (!used.has(pairKey(pairs[i][0], pairs[i][1]))) continue;
      for (let attempt = 0; attempt < 20; attempt++) {
        const j = Math.floor(Math.random() * pairs.length);
        if (j === i) continue;
        const [a1, b1] = pairs[i];
        const [a2, b2] = pairs[j];
        if (!used.has(pairKey(a1, b2)) && !used.has(pairKey(a2, b1))) {
          pairs[i] = [a1, b2];
          pairs[j] = [a2, b1];
          break;
        }
      }
    }
    for (const [x, y] of pairs) {
      used.add(pairKey(x, y));
      schedule.push(Math.random() < 0.5 ? [x, y] : [y, x]);
    }
  }
  return schedule;
}

// Builds one Swiss round: sorts by current BT score (random tiebreak, so a
// cold start degenerates to a random matching) and greedily pairs each
// applicant with the nearest-scored opponent they haven't played; if every
// remaining candidate is a rematch, the nearest one is reused (harmless extra
// data). Concentrates comparisons on close matchups, where a verdict carries
// the most ranking information. Mutates `seen` with the pairs it emits;
// display order is a coin flip like buildSchedule.
export function buildSwissRound(
  ids: string[],
  scoreOf: Map<string, number>,
  seen: Set<string>
): [string, string][] {
  const order = shuffle([...ids]).sort(
    (a, b) => (scoreOf.get(b) ?? 0) - (scoreOf.get(a) ?? 0)
  );
  const paired = new Set<string>();
  const pairs: [string, string][] = [];
  for (let i = 0; i < order.length; i++) {
    const x = order[i];
    if (paired.has(x)) continue;
    let partner = "";
    for (let j = i + 1; j < order.length; j++) {
      const y = order[j];
      if (paired.has(y)) continue;
      if (!partner) partner = y; // nearest unpaired, rematch fallback
      if (!seen.has(pairKey(x, y))) {
        partner = y;
        break;
      }
    }
    if (!partner) continue; // odd one out sits the round
    paired.add(x);
    paired.add(partner);
    seen.add(pairKey(x, partner));
    pairs.push(Math.random() < 0.5 ? [x, partner] : [partner, x]);
  }
  return pairs;
}

export type BTStanding = {
  id: string;
  score: number; // BT logit, mean-centered; P(i beats j) = σ(scoreᵢ − scoreⱼ)
  wins: number;
  losses: number;
};

// Fits Bradley-Terry scores by gradient ascent on the log-likelihood with a
// light L2 prior (keeps undefeated applicants finite). ~200 players and a few
// thousand comparisons converge in milliseconds, so callers can refit on every
// incoming result — that's what makes the live standings (and a future
// realtime viz) cheap.
export function fitBradleyTerry(
  comparisons: { winnerId: string; loserId: string }[]
): BTStanding[] {
  if (comparisons.length === 0) return [];
  const ids = [...new Set(comparisons.flatMap((c) => [c.winnerId, c.loserId]))];
  const index = new Map(ids.map((id, i) => [id, i]));
  const n = ids.length;
  const pairs = comparisons.map((c) => [index.get(c.winnerId)!, index.get(c.loserId)!]);

  const wins = new Float64Array(n);
  const losses = new Float64Array(n);
  const games = new Float64Array(n);
  for (const [w, l] of pairs) {
    wins[w]++;
    losses[l]++;
    games[w]++;
    games[l]++;
  }

  const L2 = 0.05;
  const theta = new Float64Array(n);
  const grad = new Float64Array(n);
  for (let iter = 0; iter < 300; iter++) {
    grad.fill(0);
    for (const [w, l] of pairs) {
      const p = 1 / (1 + Math.exp(theta[l] - theta[w])); // P(observed winner wins)
      grad[w] += 1 - p;
      grad[l] -= 1 - p;
    }
    for (let i = 0; i < n; i++) {
      theta[i] += (grad[i] - L2 * theta[i]) / games[i];
    }
  }

  const mean = theta.reduce((s, v) => s + v, 0) / n;
  return ids
    .map((id, i) => ({ id, score: theta[i] - mean, wins: wins[i], losses: losses[i] }))
    .sort((a, b) => b.score - a.score);
}
