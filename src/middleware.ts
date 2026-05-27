import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import type { UserRole } from "@/auth.d";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
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
  matcher: ["/my", "/my/:path*", "/reviews/write", "/admin", "/admin/:path*"]
};
