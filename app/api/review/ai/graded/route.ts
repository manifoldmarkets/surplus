import { listFieldNames, listFieldValues } from "@/lib/review/airtable";
import { requireAuth } from "@/lib/review/auth";

// GET /api/review/ai/graded?label=AI
// Returns record IDs that already have a "<label> prio" value, so runs can
// skip already-graded applicants (and interrupted runs can resume).
export async function GET(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;
  const label = new URL(req.url).searchParams.get("label") || "AI";
  const fieldName = `${label} prio`;
  try {
    const existing = await listFieldNames();
    if (!existing.has(fieldName)) return Response.json({ graded: [] });
    const values = await listFieldValues(fieldName);
    const graded = Object.entries(values)
      .filter(([, v]) => v != null && v !== "")
      .map(([id]) => id);
    return Response.json({ graded });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
