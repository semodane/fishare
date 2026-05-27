import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UserRoleSelect } from "@/components/admin/UserRoleSelect";
import { UserDeactivateButton } from "@/components/admin/UserDeactivateButton";
import type { UserRole } from "@/auth.d";

const ROLE_LABEL: Record<string, string> = { OWNER: "소유자", ADMIN: "관리자", USER: "일반" };
const ROLE_COLOR: Record<string, string> = {
  OWNER: "bg-violet-100 text-violet-700",
  ADMIN: "bg-amber-100 text-amber-700",
  USER: "bg-neutral-100 text-neutral-500"
};

export default async function AdminUsersPage() {
  const session = await auth();
  const myRole = ((session?.user as { role?: UserRole } | undefined)?.role ?? "USER") as UserRole;

  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, nickname: true, email: true, role: true,
      status: true, createdAt: true,
      _count: { select: { reviews: true } }
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-neutral-900">회원 관리</h1>
        <span className="text-sm text-neutral-500">총 {users.length}명</span>
      </div>

      {/* 데스크탑 테이블 */}
      <div className="hidden rounded-2xl border border-black/10 bg-white overflow-hidden sm:block">
        <table className="w-full text-sm">
          <thead className="border-b border-black/[0.06] bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">회원</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">역할</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">리뷰</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">가입일</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04]">
            {users.map((u) => (
              <tr key={u.id} className={u.status === "INACTIVE" ? "opacity-40" : ""}>
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-800 truncate max-w-[140px]">
                    {u.nickname ?? "(닉네임 없음)"}
                  </p>
                  <p className="text-xs text-neutral-400 truncate max-w-[140px]">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  {u.status === "ACTIVE" ? (
                    <UserRoleSelect userId={u.id} currentRole={u.role as UserRole} myRole={myRole} />
                  ) : (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${ROLE_COLOR[u.role]}`}>
                      {ROLE_LABEL[u.role]}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-700">{u._count.reviews}개</td>
                <td className="px-4 py-3 text-xs text-neutral-400">
                  {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  {u.status === "ACTIVE" && <UserDeactivateButton userId={u.id} />}
                  {u.status === "INACTIVE" && <span className="text-xs text-neutral-400">비활성</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 목록 */}
      <div className="space-y-2 sm:hidden">
        {users.map((u) => (
          <div
            key={u.id}
            className={`rounded-2xl border border-black/10 bg-white p-4 ${u.status === "INACTIVE" ? "opacity-40" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-800">
                  {u.nickname ?? "(닉네임 없음)"}
                </p>
                <p className="truncate text-xs text-neutral-400">{u.email}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  리뷰 {u._count.reviews}개 · {new Date(u.createdAt).toLocaleDateString("ko-KR")} 가입
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {u.status === "ACTIVE" ? (
                  <UserRoleSelect userId={u.id} currentRole={u.role as UserRole} myRole={myRole} />
                ) : (
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${ROLE_COLOR[u.role]}`}>
                    {ROLE_LABEL[u.role]}
                  </span>
                )}
                {u.status === "ACTIVE" && <UserDeactivateButton userId={u.id} />}
                {u.status === "INACTIVE" && <span className="text-xs text-neutral-400">비활성</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
