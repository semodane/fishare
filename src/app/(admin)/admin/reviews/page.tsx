import { prisma } from "@/lib/db";
import { ReviewDeleteButton } from "@/components/admin/ReviewDeleteButton";

const TARGET_LABEL: Record<string, string> = { boat: "선박", place: "편의시설", harbor: "항구" };
const STARS = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true, title: true, content: true, rating: true,
      targetType: true, status: true, createdAt: true,
      author: { select: { nickname: true, email: true } },
      harbor: { select: { name: true } }
    }
  });

  const active = reviews.filter(r => r.status === "ACTIVE").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-neutral-900">리뷰 관리</h1>
        <span className="text-sm text-neutral-500">활성 {active}개 / 전체 {reviews.length}개</span>
      </div>

      <div className="space-y-2">
        {reviews.map((r) => (
          <div
            key={r.id}
            className={`rounded-2xl border border-black/10 bg-white p-4 ${r.status === "INACTIVE" ? "opacity-40" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                    {TARGET_LABEL[r.targetType] ?? r.targetType}
                  </span>
                  <span className="text-[11px] text-neutral-400">{r.harbor.name}</span>
                  <span className="text-xs text-amber-500">{STARS(r.rating)}</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold text-neutral-800 truncate">{r.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{r.content}</p>
                <p className="mt-1.5 text-[11px] text-neutral-400">
                  {r.author.nickname ?? r.author.email} · {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div className="shrink-0">
                {r.status === "ACTIVE" ? (
                  <ReviewDeleteButton reviewId={r.id} />
                ) : (
                  <span className="text-xs text-neutral-400">삭제됨</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
