import Link from "next/link";
import type { Place, PlaceCategory } from "@/types/place";
import { CardBase } from "@/components/common/CardBase";
import { SectionHeader } from "@/components/common/SectionHeader";

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

export function HomeNearbyPlacesSection({ places }: { places: Place[] }) {
  return (
    <section className="space-y-3">
      <SectionHeader
        title="주변 편의 정보"
        subtitle="출항 전후에 들르기 좋은 곳"
      />

      <div className="grid grid-cols-2 gap-3">
        {places.map((p) => (
          <Link key={p.id} href={`/places/${p.id}`} className="block">
            <CardBase className="p-4 active:bg-neutral-50">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">
                  {categoryLabel(p.category)}
                </span>
                <span className="text-[11px] text-neutral-500">주변</span>
              </div>
              <div className="mt-2 line-clamp-2 text-sm font-semibold">
                {p.name}
              </div>
              <div className="mt-1 line-clamp-2 text-xs text-neutral-600">
                {p.address}
              </div>
            </CardBase>
          </Link>
        ))}
      </div>
    </section>
  );
}

