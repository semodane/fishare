import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import type { UserRole } from "@/auth.d";

const hasKakao =
  Boolean(process.env.KAKAO_CLIENT_ID) && Boolean(process.env.KAKAO_CLIENT_SECRET);
const hasGoogle =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

// Edge 런타임(미들웨어)에서도 안전하게 쓸 수 있는 경량 설정 (Prisma 제외)
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
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
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { nickname?: string }).nickname =
          (token.nickname as string | undefined) ?? undefined;
        (session.user as { dbImage?: string }).dbImage =
          (token.dbImage as string | undefined) ?? undefined;
        (session.user as { role?: UserRole }).role =
          ((token.role as string | undefined) ?? "USER") as UserRole;
      }
      return session;
    }
  }
};
