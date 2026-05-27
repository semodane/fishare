import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

const usePrismaAdapter = process.env.AUTH_USE_PRISMA_ADAPTER === "true";

const hasKakao =
  Boolean(process.env.KAKAO_CLIENT_ID) && Boolean(process.env.KAKAO_CLIENT_SECRET);
const hasGoogle =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  // Middleware runs on Edge runtime; JWT sessions work reliably via `req.auth`.
  session: { strategy: "jwt" },
  providers: [
    ...(hasGoogle
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
          })
        ]
      : []),
    ...(hasKakao
      ? [
          Kakao({
            clientId: process.env.KAKAO_CLIENT_ID ?? "",
            clientSecret: process.env.KAKAO_CLIENT_SECRET ?? ""
          })
        ]
      : [])
  ],
  adapter: usePrismaAdapter ? PrismaAdapter(prisma) : undefined,
  pages: {
    signIn: "/login"
  },
  events: {
    // 최초 가입 시 OAuth 프로필 이름을 닉네임으로 자동 설정
    createUser: async ({ user }) => {
      if (user.id && user.name) {
        await prisma.user.update({
          where: { id: user.id },
          data: { nickname: user.name }
        });
      }
    }
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const userId = user?.id ?? token.sub;
      if (userId) {
        // Node.js 런타임에서만 Prisma 접근 가능 (Edge 미들웨어에서는 skip)
        // role 변경이 즉시 반영되도록 매번 DB 조회 (try/catch로 Edge 환경 보호)
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { nickname: true, image: true, role: true }
          });
          if (user?.id) token.id = user.id;
          token.nickname = dbUser?.nickname ?? user?.name ?? (token.nickname as string | undefined);
          token.dbImage = dbUser?.image ?? (token.dbImage as string | undefined);
          token.role = dbUser?.role ?? "USER";
        } catch {
          // Edge 런타임에서는 Prisma 사용 불가 → 기존 토큰 값 유지
          if (user?.id) token.id = user.id;
          if (!token.role) token.role = "USER";
        }
      }
      // client에서 update() 호출 시 세션 즉시 반영
      if (trigger === "update") {
        if (session?.nickname !== undefined) token.nickname = session.nickname as string;
        if ("image" in (session ?? {})) token.dbImage = (session as Record<string, unknown>).image as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { nickname?: string }).nickname =
          (token.nickname as string | undefined) ?? undefined;
        (session.user as { dbImage?: string }).dbImage =
          (token.dbImage as string | undefined) ?? undefined;
        (session.user as { role?: string }).role =
          (token.role as string | undefined) ?? "USER";
      }
      return session;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
