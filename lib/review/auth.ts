import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const AUTH_COOKIE = "surplus_review";

// The cookie stores a hash of the password (not the password itself), so a
// leaked cookie can't reveal REVIEW_PASSWORD. Changing the password
// invalidates all existing sessions.
export function authCookieValue(): string {
  const password = process.env.REVIEW_PASSWORD;
  if (!password) throw new Error("REVIEW_PASSWORD is not set");
  return createHash("sha256")
    .update(`surplus-review-v1:${password}`)
    .digest("hex");
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value === authCookieValue();
}

// Guard for API route handlers: returns a 401 response, or null if authed.
export async function requireAuth(): Promise<Response | null> {
  if (await isAuthed()) return null;
  return Response.json({ error: "unauthorized" }, { status: 401 });
}
