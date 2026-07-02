import { listApplicants } from "@/lib/review/airtable";
import { requireAuth } from "@/lib/review/auth";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    return Response.json({ applicants: await listApplicants() });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
