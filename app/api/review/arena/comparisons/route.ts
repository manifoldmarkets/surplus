import { requireAuth } from "@/lib/review/auth";
import { listArenaComparisons } from "@/lib/review/instant";

// All stored arena comparisons (sans reasoning text). The /arena page refits
// Bradley-Terry from these client-side, so standings survive reloads.
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    return Response.json({ comparisons: await listArenaComparisons() });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
