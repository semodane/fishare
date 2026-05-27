import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/common/AppShell";
import { ProfileEditor } from "@/components/my/ProfileEditor";
import { MyPageActions } from "@/components/my/MyPageActions";
import { prisma } from "@/lib/db";
import type { UserRole } from "@/auth.d";

const ROLE_META: Record<UserRole, { label: string; color: string }> = {
  OWNER: { label: "소유자", color: "bg-violet-100 text-violet-700" },
  ADMIN: { label: "관리자", color: "bg-amber-100 text-amber-700" },
  USER:  { label: "일반",   color: "bg-neutral-100 text-neutral-600" }
};

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [dbUser, reviewCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { nickname: true, email: true, image: true, role: true, createdAt: true }
    }),
    prisma.review.count({
      where: { authorId: session.user.id, status: "ACTIVE", deletedAt: null }
    })
  ]);

  const role = (dbUser?.role ?? "USER") as UserRole;
  const roleMeta = ROLE_META[role];

  const joinedDate = dbUser?.createdAt
    ? dbUser.createdAt.toISOString().slice(0, 7).replace("-", ".")
    : null;

  return (
    <AppShell title="마이" activeTab="my">
      <div className="space-y-4">
        {/* 프로필 카드 */}
        <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-4">
          <ProfileEditor
            initialNickname={dbUser?.nickname ?? undefined}
            initialImage={dbUser?.image ?? undefined}
          />

          <div className="h-px bg-black/[0.06]" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-neutral-500">이메일</p>
              <p className="text-sm text-neutral-700">
                {dbUser?.email ?? session.user.email ?? "-"}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleMeta.color}`}>
              {roleMeta.label}
            </span>
          </div>

          {joinedDate && (
            <p className="text-xs text-neutral-400">{joinedDate} 가입</p>
          )}
        </div>

        {/* 활동 요약 */}
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="text-xs font-semibold text-neutral-500 mb-3">나의 활동</p>
          <Link
            href="/my/reviews"
            className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 active:bg-neutral-100"
          >
            <span className="text-sm font-medium text-neutral-800">작성한 리뷰</span>
            <span className="text-sm font-semibold text-sky-700">{reviewCount}개</span>
          </Link>
        </div>

        {/* 관리자 메뉴 — OWNER / ADMIN만 표시 */}
        {(role === "OWNER" || role === "ADMIN") && (
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs font-semibold text-neutral-500 mb-3">관리자</p>
            <Link
              href="/admin"
              className="flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3 active:bg-violet-100"
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                <span className="text-sm font-medium text-violet-800">관리자 페이지</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </div>
        )}

        {/* 로그아웃 / 회원탈퇴 */}
        <MyPageActions />
      </div>
    </AppShell>
  );
}
