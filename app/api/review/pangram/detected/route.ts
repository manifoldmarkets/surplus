import { listFieldValues } from "@/lib/review/airtable";
import { requireAuth } from "@/lib/review/auth";
import { PANGRAM_FIELD_NAME } from "@/lib/review/fields";

// GET /api/review/pangram/detected
// Returns record IDs that already have a "Pangram AI fraction" value, so
// batch runs can skip already-checked applicants (and resume if interrupted).
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const values = await listFieldValues(PANGRAM_FIELD_NAME);
    const detected = Object.entries(values)
      .filter(([, v]) => v != null && v !== "")
      .map(([id]) => id);
    return Response.json({ detected });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
