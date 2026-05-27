import Link from "next/link";
import type { Boat } from "@/types/boat";
import type { Place, PlaceCategory } from "@/types/place";
import type { TideInfo } from "@/types/tide";
import { CardBase } from "@/components/common/CardBase";
import { SectionHeader } from "@/components/common/SectionHeader";
import { EmptyState } from "@/components/common/EmptyState";

function categoryLabel(c: PlaceCategory): string {
  switch (c) {
    case "tackle_shop":
      return "낚시점";
    case "early_restaurant":
      return "새벽식당";
    case "fish_cleaning":
      return "손질";
    case "cooking_restaurant":
      return "조리";
    default: {
      const _exhaustive: never = c;
      return _exhaustive;
    }
  }
}

export function HarborTideCard({ tide }: { tide?: TideInfo }) {
  if (!tide) {
    return (
      <EmptyState
        title="물때 정보가 없어요"
        description="MVP mock 데이터 기준으로 일부 항구만 제공됩니다."
      />
    );
  }

  return (
    <CardBase className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">물때 정보</div>
          <div className="mt-0.5 text-xs text-neutral-600">
            {tide.date} · {tide.timezone}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">
          {tide.sourceLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-neutral-700">{tide.summary}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {tide.tides.slice(0, 3).map((t) => (
          <div
            key={`${t.type}-${t.time}`}
            className="rounded-xl border border-black/10 bg-white p-3"
          >
            <div className="text-xs font-semibold text-neutral-800">
              {t.type === "high" ? "만조" : "간조"}
            </div>
            <div className="mt-1 text-sm font-semibold">{t.time}</div>
            <div className="mt-0.5 text-xs text-neutral-600">
              {typeof t.heightCm === "number" ? `${t.heightCm}cm` : "—"}
            </div>
          </div>
        ))}
      </div>
    </CardBase>
  );
}

export function HarborBoatsSection({ boats }: { boats: Boat[] }) {
  return (
    <section className="space-y-3">
      <SectionHeader title="선박" subtitle="이 항구에서 출항하는 선박" />
      {boats.length === 0 ? (
        <EmptyState title="등록된 선박이 없어요" />
      ) : (
        <div className="space-y-2">
          {boats.map((b) => (
            <Link key={b.id} href={`/boats/${b.id}`} className="block">
              <CardBase className="p-4 active:bg-neutral-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{b.name}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-neutral-500">
                      {b.operatorName && b.operatorName !== "-" && (
                        <span>{b.operatorName}</span>
                      )}
                      {b.capacity > 1 && (
                        <span>정원 {b.capacity}명</span>
                      )}
                      {b.contact && (
                        <span>{b.contact}</span>
                      )}
                    </div>
                    {b.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {b.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {b.priceLabel && b.priceLabel !== "-" && (
                    <div className="shrink-0 text-xs font-semibold text-neutral-900">
                      {b.priceLabel}
                    </div>
                  )}
                </div>
              </CardBase>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function HarborPlacesSection({ places }: { places: Place[] }) {
  const byCategory = places.reduce(
    (acc, p) => {
      (acc[p.category] ??= []).push(p);
      return acc;
    },
    {} as Record<PlaceCategory, Place[]>
  );

  const categories: PlaceCategory[] = [
    "tackle_shop",
    "early_restaurant",
    "fish_cleaning",
    "cooking_restaurant"
  ];

  return (
    <section className="space-y-3">
      <SectionHeader title="주변 장소" subtitle="출항 전후 편의 정보" />
      {places.length === 0 ? (
        <EmptyState title="주변 장소 정보가 없어요" />
      ) : (
        <div className="space-y-3">
          {categories.map((c) => {
            const items = byCategory[c] ?? [];
            if (items.length === 0) return null;
            return (
              <div key={c} className="space-y-2">
                <div className="text-xs font-semibold text-neutral-700">
                  {categoryLabel(c)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {items.map((p) => (
                    <Link key={p.id} href={`/places/${p.id}`} className="block">
                      <CardBase className="p-4 active:bg-neutral-50">
                        <div className="line-clamp-2 text-sm font-semibold">
                          {p.name}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-neutral-600">
                          {p.address}
                        </div>
                      </CardBase>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}


