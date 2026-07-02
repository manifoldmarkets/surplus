import { getApplicant } from "@/lib/review/airtable";
import { requireAuth } from "@/lib/review/auth";
import { renderTemplate } from "@/lib/review/merge";

// Sends one email via Resend, rendering {{merge tags}} against the applicant.
// `overrideTo` (test sends) delivers the rendered email to a different address.
// The client loops over recipients one call at a time for visible progress
// and to stay under Resend's rate limit.
export async function POST(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { recordId, from, subject, body, overrideTo } = (await req.json()) as {
    recordId: string;
    from: string;
    subject: string;
    body: string;
    overrideTo?: string;
  };
  if (!recordId || !from || !subject || !body) {
    return Response.json(
      { error: "recordId, from, subject, body required" },
      { status: 400 }
    );
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "RESEND_API_KEY not set" }, { status: 500 });

  try {
    const applicant = await getApplicant(recordId);
    const to = overrideTo || applicant.email;
    if (!to) {
      return Response.json({ error: `${applicant.name}: no email address` }, { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: renderTemplate(subject, applicant),
        text: renderTemplate(body, applicant),
      }),
    });
    const data = (await res.json()) as { id?: string; message?: string };
    if (!res.ok) {
      return Response.json(
        { error: `Resend ${res.status}: ${data.message ?? JSON.stringify(data).slice(0, 300)}` },
        { status: 502 }
      );
    }
    return Response.json({ recordId, name: applicant.name, to, emailId: data.id });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
