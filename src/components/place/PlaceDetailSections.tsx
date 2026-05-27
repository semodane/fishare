import type { ReactNode } from "react";
import type { Review } from "@/types/review";
import { CardBase } from "@/components/common/CardBase";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { PlaceDetailVM } from "./placeView";

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">
      {children}
    </span>
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

export function PlaceSummaryCard({
  vm,
  harborName
}: {
  vm: PlaceDetailVM;
  harborName: string;
}) {
  const p = vm.place;
  return (
    <CardBase className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-base font-semibold tracking-tight">{p.name}</div>
          <div className="mt-0.5 text-xs text-neutral-600">
            {vm.categoryLabel} · {harborName}
          </div>
        </div>
        <Badge>리뷰 {vm.reviewCount}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <div className="rounded-xl bg-neutral-50 p-3">
          <div className="text-[11px] font-medium text-neutral-600">주소</div>
          <div className="mt-1 text-sm font-semibold">{p.address}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-neutral-50 p-3">
            <div className="text-[11px] font-medium text-neutral-600">연락처</div>
            <div className="mt-1 text-sm font-semibold">{p.phone ?? "—"}</div>
          </div>
          <div className="rounded-xl bg-neutral-50 p-3">
            <div className="text-[11px] font-medium text-neutral-600">영업시간</div>
            <div className="mt-1 text-sm font-semibold">{p.openHours ?? "—"}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(vm.specialInfo).map(([k, v]) => (
          <Badge key={k}>
            {k}
            {typeof v === "boolean" ? (v ? "" : " (X)") : `: ${v}`}
          </Badge>
        ))}
      </div>

      {p.note ? <p className="mt-3 text-sm text-neutral-700">{p.note}</p> : null}
    </CardBase>
  );
}

export function PlaceReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="space-y-3">
      <SectionHeader title="리뷰" subtitle="이 장소에 대한 후기" />
      {reviews.length === 0 ? (
        <EmptyState title="아직 리뷰가 없어요" />
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => (
            <CardBase key={r.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <Stars rating={r.rating} />
                <span className="text-xs text-neutral-500">{r.visitedAt}</span>
              </div>
              <div className="mt-2 text-sm font-semibold">{r.title}</div>
              <p className="mt-1 line-clamp-3 text-sm text-neutral-700">{r.content}</p>
            </CardBase>
          ))}
        </div>
      )}
    </section>
  );
}

