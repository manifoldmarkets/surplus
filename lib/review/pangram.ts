import "server-only";

// Pangram AI-detection client (https://docs.pangram.com/api-reference/ai-detection).
// The API is async: POST /task returns a task_id, then poll GET /task/{id}
// until the stage is terminal.

const API = "https://text.external-api.pangram.com";
const POLL_MS = 2_000;
const TIMEOUT_MS = 120_000;

export type PangramWindow = {
  text: string;
  label: string;
  ai_assistance_score: number;
  confidence: string;
  start_index: number;
  end_index: number;
  word_count: number;
  token_length: number;
};

export type PangramResult = {
  stage: string;
  text: string;
  version?: string;
  headline?: string;
  prediction?: string;
  prediction_short: string; // "AI" | "AI-Assisted" | "Human" | "Mixed"
  fraction_ai: number;
  fraction_ai_assisted: number;
  fraction_human: number;
  num_ai_segments?: number;
  num_ai_assisted_segments?: number;
  num_human_segments?: number;
  dashboard_link?: string;
  windows?: PangramWindow[];
};

function headers(): HeadersInit {
  const key = process.env.PANGRAM_API_KEY;
  if (!key) throw new Error("PANGRAM_API_KEY is not set");
  return { "x-api-key": key, "Content-Type": "application/json" };
}

export async function detectAi(text: string): Promise<PangramResult> {
  const submit = await fetch(`${API}/task`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ text }),
  });
  if (!submit.ok) {
    const body = await submit.text();
    throw new Error(`Pangram ${submit.status}: ${body.slice(0, 300)}`);
  }
  const { task_id } = (await submit.json()) as { task_id: string };

  const deadline = Date.now() + TIMEOUT_MS;
  for (;;) {
    await new Promise((r) => setTimeout(r, POLL_MS));
    const res = await fetch(`${API}/task/${task_id}`, { headers: headers() });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Pangram ${res.status}: ${body.slice(0, 300)}`);
    }
    const task = (await res.json()) as PangramResult;
    if (task.stage === "STAGE_SUCCESS") return task;
    if (task.stage === "STAGE_FAILED") throw new Error("Pangram task failed");
    if (Date.now() > deadline) throw new Error("Pangram task timed out after 120s");
  }
}
