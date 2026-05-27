import Link from "next/link";
import type { Review } from "@/types/review";
import { CardBase } from "@/components/common/CardBase";
import { SectionHeader } from "@/components/common/SectionHeader";

function Stars({ rating }: { rating: Review["rating"] }) {
  const full = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return (
    <span aria-label={`별점 ${rating}점`} className="text-xs text-amber-500">
      {full}
      <span className="text-neutral-300">{empty}</span>
    </span>
  );
}

function reviewHref(r: Review): string {
  switch (r.targetType) {
    case "harbor":
      return `/harbors/${r.targetId}`;
    case "boat":
      return `/boats/${r.targetId}`;
    case "place":
      return `/places/${r.targetId}`;
    default: {
      const _exhaustive: never = r.targetType;
      return _exhaustive;
    }
  }
}

function targetLabel(r: Review): string {
  switch (r.targetType) {
    case "harbor":
      return "항구";
    case "boat":
      return "선박";
    case "place":
      return "장소";
    default: {
      const _exhaustive: never = r.targetType;
      return _exhaustive;
    }
  }
}

export function HomeRecentReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="space-y-3">
      <SectionHeader title="최근 리뷰" subtitle="따끈한 후기들을 확인해보세요" />

      <div className="space-y-2">
        {reviews.map((r) => (
          <Link key={r.id} href={reviewHref(r)} className="block">
            <CardBase className="p-4 active:bg-neutral-50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">
                      {targetLabel(r)}
                    </span>
                    <Stars rating={r.rating} />
                    <span className="text-xs text-neutral-500">
                      {r.visitedAt}
                    </span>
                  </div>
                  <div className="mt-2 truncate text-sm font-semibold">
                    {r.title}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-700">
                    {r.content}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-black/10 bg-white px-2 py-1 text-[11px] font-medium text-neutral-700">
                  상세
                </span>
              </div>
            </CardBase>
          </Link>
        ))}
      </div>
    </section>
  );
}

