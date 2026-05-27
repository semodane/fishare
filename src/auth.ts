import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { authConfig } from "@/auth.config";

const usePrismaAdapter = process.env.AUTH_USE_PRISMA_ADAPTER === "true";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: usePrismaAdapter ? PrismaAdapter(prisma) : undefined,
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
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      const userId = user?.id ?? token.sub;
      if (userId) {
        // Node.js 런타임에서만 Prisma 접근 가능 (Edge 미들웨어에서는 skip)
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
    }
  }
});
