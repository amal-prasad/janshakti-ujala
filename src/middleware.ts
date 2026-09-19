import { NextResponse, type NextRequest } from "next/server";

// Site-wide "under construction" gate. Flip to false to bring the public site back.
// ponytail: a const, not an env var — restoring needs a deploy anyway.
export const MAINTENANCE = false;

// /newsroom stays open so the desk can keep writing while the public site is down.
const OPEN_PREFIXES = ["/newsroom", "/api", "/_next", "/logo.png", "/favicon.ico"];

export function middleware(req: NextRequest) {
  if (!MAINTENANCE) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (OPEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }
  if (pathname === "/nirmanadhin") return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/nirmanadhin";
  const headers = new Headers(req.headers);
  headers.set("x-maintenance", "1");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
