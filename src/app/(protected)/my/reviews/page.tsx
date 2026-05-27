import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/common/AppShell";
import { getReviewsByUser } from "@/lib/queries/review";
import { prisma } from "@/lib/db";
import type { Review } from "@/types/review";

const STAR = "★";
const EMPTY_STAR = "☆";

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-sm leading-none">
      {Array.from({ length: 5 }, (_, i) => (i < rating ? STAR : EMPTY_STAR)).join("")}
    </span>
  );
}

type TargetMeta = { name: string; href: string };

async function buildTargetMap(reviews: Review[]): Promise<Map<string, TargetMeta>> {
  const boatIds = reviews.filter((r) => r.targetType === "boat").map((r) => r.targetId);
  const placeIds = reviews.filter((r) => r.targetType === "place").map((r) => r.targetId);

  const [boats, places] = await Promise.all([
    boatIds.length > 0
      ? prisma.boat.findMany({ where: { id: { in: boatIds } }, select: { id: true, name: true } })
      : Promise.resolve([]),
    placeIds.length > 0
      ? prisma.place.findMany({ where: { id: { in: placeIds } }, select: { id: true, name: true } })
      : Promise.resolve([])
  ]);

  const map = new Map<string, TargetMeta>();
  for (const b of boats) map.set(b.id, { name: b.name, href: `/boats/${b.id}` });
  for (const p of places) map.set(p.id, { name: p.name, href: `/places/${p.id}` });
  return map;
}

const TARGET_LABEL: Record<string, string> = {
  boat: "낚시배",
  place: "편의시설"
};

export default async function MyReviewsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const reviews = await getReviewsByUser(session.user.id);
  const targetMap = await buildTargetMap(reviews);

  return (
    <AppShell title="나의 리뷰" activeTab="my_reviews">
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-center">
            <p className="text-sm font-medium text-neutral-600">아직 작성한 리뷰가 없어요</p>
            <Link
              href="/reviews/write"
              className="mt-3 inline-block rounded-xl bg-sky-600 px-5 py-2 text-sm font-semibold text-white active:bg-sky-700"
            >
              리뷰 작성하러 가기
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-neutral-500 font-medium">
              총 {reviews.length}개의 리뷰
            </p>
            {reviews.map((review) => {
              const meta = targetMap.get(review.targetId);
              const label = TARGET_LABEL[review.targetType] ?? review.targetType;
              const visitedDate = review.visitedAt.slice(0, 7).replace("-", ".");
              return (
                <article
                  key={review.id}
                  className="rounded-2xl border border-black/10 bg-white p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 mb-1">
                        {label}
                      </span>
                      {meta ? (
                        <Link
                          href={meta.href}
                          className="block text-sm font-semibold text-neutral-900 hover:text-sky-700 truncate"
                        >
                          {meta.name}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          (삭제된 항목)
                        </p>
                      )}
                    </div>
                    <StarRow rating={review.rating} />
                  </div>

                  <p className="text-sm font-semibold text-neutral-800 leading-snug">
                    {review.title}
                  </p>
                  {review.content ? (
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
                      {review.content}
                    </p>
                  ) : null}

                  <p className="text-xs text-neutral-400">
                    방문 {visitedDate} · {review.createdAt.slice(0, 10).replace(/-/g, ".")} 작성
                  </p>
                </article>
              );
            })}
          </>
        )}
      </div>
    </AppShell>
  );
}
