import { getApplicant, updateApplicant } from "@/lib/review/airtable";
import { requireAuth } from "@/lib/review/auth";
import { F } from "@/lib/review/fields";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    return Response.json({ applicant: await getApplicant(id) });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

// Editable fields, mapped from normalized keys to Airtable field IDs.
const EDITABLE: Record<string, string> = {
  austinNotes: F.austinNotes,
  austinPostInterviewNotes: F.austinPostInterviewNotes,
  austinPrio: F.austinPrio,
  status: F.status,
};

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = (await req.json()) as Record<string, unknown>;

  const fields: Record<string, unknown> = {};
  for (const [key, fieldId] of Object.entries(EDITABLE)) {
    if (key in body) fields[fieldId] = body[key];
  }
  if (Object.keys(fields).length === 0) {
    return Response.json({ error: "no editable fields in body" }, { status: 400 });
  }
  try {
    return Response.json({ applicant: await updateApplicant(id, fields) });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
