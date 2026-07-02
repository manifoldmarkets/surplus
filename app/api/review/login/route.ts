import { cookies } from "next/headers";
import { AUTH_COOKIE, authCookieValue } from "@/lib/review/auth";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };
  if (!process.env.REVIEW_PASSWORD || password !== process.env.REVIEW_PASSWORD) {
    return Response.json({ error: "wrong password" }, { status: 401 });
  }
  const store = await cookies();
  store.set(AUTH_COOKIE, authCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return Response.json({ ok: true });
}
