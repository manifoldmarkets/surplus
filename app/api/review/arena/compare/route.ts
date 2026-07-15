import { parseVerdict } from "@/lib/review/arena";
import { requireAuth } from "@/lib/review/auth";
import { saveArenaComparison } from "@/lib/review/instant";

// Judges one pairwise comparison via OpenRouter and appends the verdict to
// InstantDB (`arenaComparisons`). The client sends both applicants' rendered
// application text in the body — at ~25-concurrent, fetching them from
// Airtable here would blow its 5 req/s rate limit. No Airtable writes.
export async function POST(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { a, b, model, prompt, save } = (await req.json()) as {
    a: { id: string; name: string; text: string };
    b: { id: string; name: string; text: string };
    model: string;
    prompt: string;
    save?: boolean; // default true; false = probe/dry run (no Instant write)
  };
  if (!a?.id || !a?.text || !b?.id || !b?.text || !model || !prompt) {
    return Response.json({ error: "a, b, model, prompt required" }, { status: 400 });
  }
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return Response.json({ error: "OPENROUTER_API_KEY not set" }, { status: 500 });

  try {
    // Function replacements so "$&"-style sequences in applicant text aren't
    // interpreted as substitution patterns.
    const filled = prompt
      .replace("{{APPLICATION_A}}", () => a.text)
      .replace("{{APPLICATION_B}}", () => b.text);

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
        // A verdict is ~150 tokens; a model silently "thinking" for thousands
        // turns 5s calls into 30s+ ones, so reasoning is off (ARENA-SPEC.md).
        max_tokens: 500,
        reasoning: { enabled: false },
        // Asks OpenRouter to report token counts + dollar cost per call —
        // this is what the page's cost estimate is built on.
        usage: { include: true },
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
      usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number };
      error?: { message?: string };
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    if (!content) {
      return Response.json(
        { error: `Empty completion: ${data.error?.message ?? "unknown"}` },
        { status: 502 }
      );
    }
    const verdict = parseVerdict(content);
    if (!verdict) {
      return Response.json(
        { error: `No [A]/[B] verdict in completion: ${content.slice(0, 200)}` },
        { status: 502 }
      );
    }
    const winner = verdict === "A" ? a : b;
    const loser = verdict === "A" ? b : a;
    const usage = {
      promptTokens: data.usage?.prompt_tokens ?? null,
      completionTokens: data.usage?.completion_tokens ?? null,
      cost: data.usage?.cost ?? null,
    };

    if (save !== false) {
      await saveArenaComparison({
        aId: a.id,
        aName: a.name,
        bId: b.id,
        bName: b.name,
        winnerId: winner.id,
        loserId: loser.id,
        model,
        reasoning: content,
        ...usage,
      });
    }

    return Response.json({
      winnerId: winner.id,
      loserId: loser.id,
      reasoning: content,
      usage,
      saved: save !== false,
    });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
