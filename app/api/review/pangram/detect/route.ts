import { getApplicant, updateApplicant } from "@/lib/review/airtable";
import { requireAuth } from "@/lib/review/auth";
import { F } from "@/lib/review/fields";
import { latestPangramResult, savePangramResult } from "@/lib/review/instant";
import { detectAi } from "@/lib/review/pangram";

// Runs one applicant's main idea through Pangram AI detection. The full
// response is appended to the InstantDB `pangramResults` table and the
// fraction_ai score is written to Airtable ("Pangram AI fraction"). The
// client fans out one call per applicant, same as AI grading.
export async function POST(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { recordId, write, force } = (await req.json()) as {
    recordId: string;
    write?: boolean; // default true; false = dry run (no Instant/Airtable writes)
    force?: boolean; // true = re-query Pangram even if Instant has a result
  };
  if (!recordId) {
    return Response.json({ error: "recordId required" }, { status: 400 });
  }

  try {
    const applicant = await getApplicant(recordId);
    const text = applicant.mainIdea.trim();
    if (!text) {
      return Response.json(
        { error: "Applicant has no main idea text" },
        { status: 400 }
      );
    }

    // Reuse a stored result for the same text instead of re-querying Pangram
    // (a failed lookup just means a cache miss, e.g. Instant not configured).
    const cached = force
      ? null
      : await latestPangramResult(recordId, text).catch(() => null);
    const result = cached ?? (await detectAi(text));

    let updated = applicant;
    if (write !== false) {
      if (!cached) {
        await savePangramResult({
          applicantId: recordId,
          applicantName: applicant.name,
          text,
          result,
        });
      }
      updated = await updateApplicant(recordId, {
        [F.pangramFractionAi]: result.fraction_ai,
      });
    }

    return Response.json({
      recordId,
      name: applicant.name,
      fractionAi: result.fraction_ai,
      fractionAiAssisted: result.fraction_ai_assisted,
      fractionHuman: result.fraction_human,
      predictionShort: result.prediction_short,
      dashboardLink: result.dashboard_link ?? null,
      cached: !!cached,
      wrote: write !== false,
      applicant: updated,
    });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
