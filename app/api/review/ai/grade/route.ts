import { ensureAiFields, getApplicant, updateApplicant } from "@/lib/review/airtable";
import { parseScore } from "@/lib/review/ai";
import { requireAuth } from "@/lib/review/auth";
import { applicationText } from "@/lib/review/fields";

// Grades one applicant with an OpenRouter model and writes the result to
// Airtable ("<label> prio" / "<label> notes"). The client fans out one call
// per applicant so progress is visible and serverless timeouts are a non-issue.
export async function POST(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { recordId, model, prompt, label, write } = (await req.json()) as {
    recordId: string;
    model: string;
    prompt: string;
    label?: string;
    write?: boolean; // default true; false = dry run (no Airtable write)
  };
  if (!recordId || !model || !prompt) {
    return Response.json({ error: "recordId, model, prompt required" }, { status: 400 });
  }
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return Response.json({ error: "OPENROUTER_API_KEY not set" }, { status: 500 });

  try {
    const applicant = await getApplicant(recordId);
    // Function replacement so "$&"-style sequences in applicant text aren't
    // interpreted as substitution patterns.
    const filled = prompt.replace("{{APPLICATION}}", () => applicationText(applicant));

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://surplus.dev",
        "X-Title": "Surplus review",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: filled }],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        { error: `OpenRouter ${res.status}: ${text.slice(0, 300)}` },
        { status: 502 }
      );
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
      error?: { message?: string };
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    if (!content) {
      return Response.json(
        { error: `Empty completion: ${data.error?.message ?? "unknown"}` },
        { status: 502 }
      );
    }
    const score = parseScore(content);

    if (write !== false) {
      const { prioField, notesField } = await ensureAiFields(label || "AI");
      await updateApplicant(recordId, {
        ...(score != null ? { [prioField]: score } : {}),
        [notesField]: content,
      });
    }

    return Response.json({
      recordId,
      name: applicant.name,
      score,
      reasoning: content,
      usage: data.usage ?? null,
      wrote: write !== false,
    });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
