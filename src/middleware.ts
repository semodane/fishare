import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import type { UserRole } from "@/auth.d";
import { type NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const COOKIE_NAMES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Host-authjs.csrf-token",
  "authjs.csrf-token",
];

// 4KB 초과 쿠키를 감지해 강제 삭제
function clearOversizedCookies(req: NextRequest): NextResponse | null {
  const cookieHeader = req.headers.get("cookie") ?? "";
  if (cookieHeader.length < 4096) return null;

  const res = NextResponse.redirect(req.nextUrl);
  for (const name of COOKIE_NAMES) {
    res.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
  return res;
}

export default auth((req) => {
  // 큰 쿠키 먼저 정리
  const clearRes = clearOversizedCookies(req);
  if (clearRes) return clearRes;

  const isAuthed = Boolean(req.auth);
  const role = (req.auth?.user as { role?: UserRole } | undefined)?.role ?? "USER";
  const { pathname, search } = req.nextUrl;

  // 로그인 필요 경로
  const protectedPaths = ["/my", "/reviews/write"];
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isProtected && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", `${pathname}${search}`);
    return Response.redirect(url);
  }

  // 관리자 전용 경로 (/admin)
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  if (isAdminPath) {
    if (!isAuthed) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", `${pathname}${search}`);
      return Response.redirect(url);
    }
    if (role !== "OWNER" && role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return Response.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ]
};
