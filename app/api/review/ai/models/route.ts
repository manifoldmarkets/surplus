import { requireAuth } from "@/lib/review/auth";

// Proxies OpenRouter's public model list (avoids CORS + keeps clients uniform).
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  const res = await fetch("https://openrouter.ai/api/v1/models");
  if (!res.ok) {
    return Response.json({ error: `OpenRouter ${res.status}` }, { status: 502 });
  }
  const { data } = (await res.json()) as {
    data: { id: string; name: string; pricing?: { prompt?: string; completion?: string } }[];
  };
  const models = data
    .map((m) => ({ id: m.id, name: m.name, pricing: m.pricing }))
    .sort((a, b) => a.id.localeCompare(b.id));
  return Response.json({ models });
}
