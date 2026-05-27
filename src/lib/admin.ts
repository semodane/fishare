import { auth } from "@/auth";
import type { UserRole } from "@/auth.d";
import { NextResponse } from "next/server";

/** API 라우트에서 어드민 권한 확인. 권한 없으면 Response 반환, 있으면 userId 반환 */
export async function requireAdmin(): Promise<
  { ok: true; userId: string; role: UserRole } | { ok: false; res: NextResponse }
> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const role = ((session?.user as { role?: UserRole } | undefined)?.role ?? "USER") as UserRole;

  if (!userId) {
    return {
      ok: false,
      res: NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다" } }, { status: 401 })
    };
  }
  if (role !== "OWNER" && role !== "ADMIN") {
    return {
      ok: false,
      res: NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "권한이 없습니다" } }, { status: 403 })
    };
  }
  return { ok: true, userId, role };
}
