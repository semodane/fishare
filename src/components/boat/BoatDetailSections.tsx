import type { ReactNode } from "react";
import type { BoatDetailScores, Review } from "@/types/review";
import { CardBase } from "@/components/common/CardBase";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { BoatDetailVM, Score5 } from "./boatView";

function Bar({ score }: { score: Score5 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-sky-600"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-neutral-800">{score}/5</span>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">
      {children}
    </span>
  );
}

export function BoatSummaryCard({ vm, harborName }: { vm: BoatDetailVM; harborName: string }) {
  return (
    <CardBase className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold tracking-tight">{vm.boat.name}</div>
          <div className="mt-0.5 text-xs text-neutral-600">
            {harborName}{vm.boat.contact && vm.boat.contact !== "-" ? ` · ${vm.boat.contact}` : ""}
          </div>
        </div>
        <Badge>리뷰 {vm.reviewCount}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {vm.representativeFish.slice(0, 3).map((f) => (
          <span
            key={f}
            className="rounded-full bg-sky-50 px-2 py-1 text-[11px] font-medium text-sky-800"
          >
            {f}
          </span>
        ))}
        <Badge>정원 {vm.boat.capacity}명</Badge>
        <Badge>{vm.boat.priceLabel}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-neutral-50 p-3">
          <div className="text-[11px] font-medium text-neutral-600">선박 상태</div>
          <div className="mt-2">
            <Bar score={vm.scores.condition} />
          </div>
        </div>
        <div className="rounded-xl bg-neutral-50 p-3">
          <div className="text-[11px] font-medium text-neutral-600">선장 친절</div>
          <div className="mt-2">
            <Bar score={vm.scores.captainKindness} />
          </div>
        </div>
        <div className="rounded-xl bg-neutral-50 p-3">
          <div className="text-[11px] font-medium text-neutral-600">화장실</div>
          <div className="mt-2">
            <Bar score={vm.scores.restroomCleanliness} />
          </div>
        </div>
        <div className="rounded-xl bg-neutral-50 p-3">
          <div className="text-[11px] font-medium text-neutral-600">초보 추천</div>
          <div className="mt-2">
            <Bar score={vm.scores.beginnerFriendly} />
          </div>
        </div>
        <div className="rounded-xl bg-neutral-50 p-3">
          <div className="text-[11px] font-medium text-neutral-600">안내 만족</div>
          <div className="mt-2">
            <Bar score={vm.scores.guidanceSatisfaction} />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{vm.features.equipmentRental ? "장비 대여 가능" : "장비 대여 없음"}</Badge>
        <Badge>{vm.features.lifeJacketProvided ? "구명조끼 제공" : "구명조끼 미제공"}</Badge>
      </div>
    </CardBase>
  );
}

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

export function BoatReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="space-y-3">
      <SectionHeader title="리뷰" subtitle="이 선박에 대한 후기" />
      {reviews.length === 0 ? (
        <EmptyState title="아직 리뷰가 없어요" />
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => {
            const ds = r.detailScores as BoatDetailScores | undefined;
            return (
              <CardBase key={r.id} className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-neutral-500">{r.visitedAt}</span>
                </div>
                <div className="mt-2 text-sm font-semibold">{r.title}</div>
                <p className="mt-1 line-clamp-3 text-sm text-neutral-700">{r.content}</p>
                {ds && (
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-black/[0.06] pt-3">
                    {([
                      ["선장 친절", ds.captainKindness],
                      ["청결", ds.cleanliness],
                      ["화장실", ds.restroomCleanliness],
                      ["초보 추천", ds.beginnerFriendly],
                      ["안내 만족", ds.guidanceSatisfaction]
                    ] as [string, number | undefined][]).filter(([, v]) => v !== undefined).map(([label, v]) => (
                      <div key={label} className="flex items-center gap-1 text-xs text-neutral-500">
                        <span>{label}</span>
                        <span className="font-semibold text-neutral-800">{v}/5</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardBase>
            );
          })}
        </div>
      )}
    </section>
  );
}

