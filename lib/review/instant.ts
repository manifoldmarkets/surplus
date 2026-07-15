import "server-only";
import { id, init } from "@instantdb/admin";
import type { PangramResult } from "@/lib/review/pangram";

// InstantDB app from REVIEW-SPEC.md. Airtable stays the source of truth for
// review state; Instant only stores raw payloads that don't fit Airtable
// cells (full Pangram responses, arena pairwise comparisons).
const APP_ID =
  process.env.INSTANT_APP_ID || "fb98d9c6-b4a0-4ecb-935d-4cd969c873d6";

function db() {
  const adminToken = process.env.INSTANT_ADMIN_TOKEN;
  if (!adminToken) {
    throw new Error(
      "INSTANT_ADMIN_TOKEN is not set (instantdb.com → app → Admin tokens)"
    );
  }
  return init({ appId: APP_ID, adminToken });
}

// Most recent stored Pangram response for this applicant whose analyzed
// text matches — a cache hit means we can skip re-querying Pangram. A stale
// row (main idea edited since) is not a match.
export async function latestPangramResult(
  applicantId: string,
  text: string
): Promise<PangramResult | null> {
  const client = db();
  const res = (await client.query({
    pangramResults: { $: { where: { applicantId } } },
  })) as {
    pangramResults?: { text?: string; createdAt?: number; response?: PangramResult }[];
  };
  const match = (res.pangramResults ?? [])
    .filter((r) => r.text === text && r.response)
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))[0];
  return match?.response ?? null;
}

// One arena pairwise comparison as stored in / read from the
// `arenaComparisons` table. aId/bId record the order the applicants were
// shown to the judge (A first); winnerId/loserId are the verdict.
export type ArenaComparisonRow = {
  aId: string;
  aName: string;
  bId: string;
  bName: string;
  winnerId: string;
  loserId: string;
  model: string;
  promptTokens: number | null;
  completionTokens: number | null;
  cost: number | null;
  createdAt: number;
};

// Appends one comparison to `arenaComparisons` — append-only, never an
// upsert: raw comparisons are the durable asset, scores are refit from them.
export async function saveArenaComparison(
  entry: Omit<ArenaComparisonRow, "createdAt"> & { reasoning: string }
): Promise<void> {
  const client = db();
  await client.transact(
    client.tx.arenaComparisons[id()].update({ ...entry, createdAt: Date.now() })
  );
}

// All stored comparisons, without the reasoning text (the standings page
// only needs verdicts; keeps the payload small).
export async function listArenaComparisons(): Promise<ArenaComparisonRow[]> {
  const client = db();
  const res = (await client.query({ arenaComparisons: {} })) as {
    arenaComparisons?: (Partial<ArenaComparisonRow> & { reasoning?: string })[];
  };
  return (res.arenaComparisons ?? [])
    .filter((r) => r.winnerId && r.loserId)
    .map((r) => ({
      aId: r.aId ?? "",
      aName: r.aName ?? "",
      bId: r.bId ?? "",
      bName: r.bName ?? "",
      winnerId: r.winnerId!,
      loserId: r.loserId!,
      model: r.model ?? "",
      promptTokens: r.promptTokens ?? null,
      completionTokens: r.completionTokens ?? null,
      cost: r.cost ?? null,
      createdAt: r.createdAt ?? 0,
    }));
}

// Appends a row to the `pangramResults` table — a run history keyed by
// applicantId, not an upsert, so reruns are preserved.
export async function savePangramResult(entry: {
  applicantId: string;
  applicantName: string;
  text: string;
  result: PangramResult;
}): Promise<void> {
  const client = db();
  await client.transact(
    client.tx.pangramResults[id()].update({
      applicantId: entry.applicantId,
      applicantName: entry.applicantName,
      text: entry.text,
      fractionAi: entry.result.fraction_ai,
      fractionAiAssisted: entry.result.fraction_ai_assisted,
      fractionHuman: entry.result.fraction_human,
      predictionShort: entry.result.prediction_short,
      response: entry.result,
      createdAt: Date.now(),
    })
  );
}
