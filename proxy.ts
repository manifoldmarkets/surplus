import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const config = {
  matcher: ["/review/:path*", "/api/review/:path*"],
};

const AUTH_COOKIE = "surplus_review";

// Duplicated from lib/review/auth.ts (which imports next/headers and can't be
// used here). Keep the salt string in sync.
function authCookieValue(): string {
  return createHash("sha256")
    .update(`surplus-review-v1:${process.env.REVIEW_PASSWORD ?? ""}`)
    .digest("hex");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/review/login" || pathname === "/api/review/login") {
    return NextResponse.next();
  }

  const authed =
    !!process.env.REVIEW_PASSWORD &&
    request.cookies.get(AUTH_COOKIE)?.value === authCookieValue();
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/review")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/review/login", request.url));
}
