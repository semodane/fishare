import Link from "next/link";
import type { FeaturedHarborItem } from "@/lib/mocks/home";
import { CardBase } from "@/components/common/CardBase";
import { SectionHeader } from "@/components/common/SectionHeader";

const TARGET_LABEL: Record<string, string> = {
  boat: "선박",
  place: "시설"
};

export function HomeFeaturedHarborsSection({
  harbors
}: {
  harbors: FeaturedHarborItem[];
}) {
  return (
    <section className="space-y-3">
      <SectionHeader
        title="대표 항구"
        subtitle="오늘 출조는 어디로 갈까요?"
        action={
          <Link
            href="/harbors"
            className="text-xs font-medium text-sky-700 hover:underline"
          >
            전체보기
          </Link>
        }
      />

      <div className="-mx-4 overflow-x-auto px-4 pb-1">
        <div className="flex gap-3">
          {harbors.map((h) => (
            <Link
              key={h.id}
              href={`/harbors/${h.id}`}
              className="block w-[260px] shrink-0"
            >
              <CardBase className="flex h-[210px] flex-col p-4 active:bg-neutral-50">
                {/* 항구 기본 정보 */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{h.name}</div>
                    <div className="mt-0.5 text-xs text-neutral-600">
                      {h.region} · {h.areaLabel}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-black/10 bg-white px-2 py-1 text-[11px] font-medium text-neutral-700">
                    {h.recentReviews.length > 0 ? "최근 리뷰" : "추천"}
                  </span>
                </div>

                {/* 태그 */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {h.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* 최근 리뷰 — 남은 공간을 채우며 하단 정렬 */}
                <div className="mt-auto border-t border-black/5 pt-3">
                  {h.recentReviews.length > 0 ? (
                    <div className="space-y-2">
                      {h.recentReviews.map((r) => (
                        <div key={r.id} className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium text-amber-500">
                              {"★".repeat(r.rating)}
                              <span className="text-neutral-300">
                                {"★".repeat(5 - r.rating)}
                              </span>
                            </span>
                            <span className="rounded-full bg-sky-50 px-1.5 py-0.5 text-[10px] text-sky-700">
                              {TARGET_LABEL[r.targetType] ?? r.targetType}
                            </span>
                            <span className="text-[10px] text-neutral-400">{r.visitedAt}</span>
                          </div>
                          <p className="line-clamp-1 text-xs text-neutral-700">{r.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">아직 리뷰가 없어요.</p>
                  )}
                </div>
              </CardBase>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
