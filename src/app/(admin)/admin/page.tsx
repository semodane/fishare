import { prisma } from "@/lib/db";

async function getStats() {
  const [
    totalUsers, newUsersToday,
    totalReviews, newReviewsToday,
    totalBoats, totalPlaces, totalHarbors
  ] = await Promise.all([
    prisma.user.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.user.count({
      where: { status: "ACTIVE", deletedAt: null, createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
    }),
    prisma.review.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.review.count({
      where: { status: "ACTIVE", deletedAt: null, createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
    }),
    prisma.boat.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.place.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.harbor.count({ where: { status: "ACTIVE", deletedAt: null } })
  ]);
  return { totalUsers, newUsersToday, totalReviews, newReviewsToday, totalBoats, totalPlaces, totalHarbors };
}

async function getRecentActivity() {
  const [recentUsers, recentReviews] = await Promise.all([
    prisma.user.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, nickname: true, email: true, role: true, createdAt: true }
    }),
    prisma.review.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, rating: true, targetType: true, createdAt: true, author: { select: { nickname: true, email: true } } }
    })
  ]);
  return { recentUsers, recentReviews };
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-neutral-900">{value.toLocaleString()}</p>
      {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()]);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-neutral-900">대시보드</h1>

      {/* 핵심 통계 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="전체 회원" value={stats.totalUsers} sub={`오늘 +${stats.newUsersToday}`} />
        <StatCard label="전체 리뷰" value={stats.totalReviews} sub={`오늘 +${stats.newReviewsToday}`} />
        <StatCard label="등록 선박" value={stats.totalBoats} />
        <StatCard label="편의시설" value={stats.totalPlaces} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="항구 수" value={stats.totalHarbors} />
      </div>

      {/* 최근 활동 */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* 최근 가입 */}
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-neutral-800">최근 가입 회원</p>
          <div className="space-y-2">
            {activity.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-800">
                    {u.nickname ?? u.email ?? "(이름 없음)"}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  u.role === "OWNER" ? "bg-violet-100 text-violet-700" :
                  u.role === "ADMIN" ? "bg-amber-100 text-amber-700" :
                  "bg-neutral-100 text-neutral-500"
                }`}>{u.role === "OWNER" ? "소유자" : u.role === "ADMIN" ? "관리자" : "일반"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 리뷰 */}
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-neutral-800">최근 작성 리뷰</p>
          <div className="space-y-2">
            {activity.recentReviews.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-800">{r.title}</p>
                  <p className="text-xs text-neutral-400">
                    {r.author.nickname ?? r.author.email} · {r.targetType === "boat" ? "선박" : "편의시설"}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-amber-500">{"★".repeat(r.rating)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
