import type { DefaultSession } from "next-auth";

export type UserRole = "OWNER" | "ADMIN" | "USER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nickname?: string;
      dbImage?: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
    nickname?: string;
    dbImage?: string;
    role?: UserRole;
  }
}
