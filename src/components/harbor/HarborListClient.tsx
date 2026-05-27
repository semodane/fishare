"use client";

import { useMemo, useState } from "react";
import type { Harbor } from "@/types/harbor";
import type { Review } from "@/types/review";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CardBase } from "@/components/common/CardBase";
import { HarborCard } from "./HarborCard";
import { getHarborCardVM } from "./harborView";

const REGIONS = ["전체", "전북", "충남", "인천", "제주", "경남", "강원", "전남"] as const;
type RegionFilter = (typeof REGIONS)[number];

export function HarborListClient({
  harbors,
  reviews
}: {
  harbors: Harbor[];
  reviews: Review[];
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<RegionFilter>("전체");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return harbors.filter((h) => {
      const matchQuery =
        q.length === 0 ||
        h.name.toLowerCase().includes(q) ||
        h.region.toLowerCase().includes(q) ||
        h.areaLabel.toLowerCase().includes(q);
      const matchRegion = region === "전체" ? true : h.region === region;
      return matchQuery && matchRegion;
    });
  }, [harbors, query, region]);

  const vms = useMemo(
    () => filtered.map((harbor) => getHarborCardVM({ harbor, reviews })),
    [filtered, reviews]
  );

  return (
    <div className="space-y-4">
      <CardBase className="p-4">
        <div className="space-y-3">
          <label className="block">
            <span className="sr-only">항구 검색</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="항구명/지역으로 검색"
              className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />
          </label>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="shrink-0 text-xs font-medium text-neutral-600">
              지역
            </span>
            {REGIONS.map((r) => {
              const active = r === region;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={[
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                    active
                      ? "bg-sky-700 text-white"
                      : "border border-black/10 bg-white text-neutral-700 active:bg-neutral-50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      </CardBase>

      <SectionHeader
        title="항구 카드"
        subtitle={`${vms.length}개 항구`}
      />

      {vms.length === 0 ? (
        <EmptyState
          title="검색 결과가 없어요"
          description="다른 키워드로 검색해보세요."
        />
      ) : (
        <ul className="space-y-2">
          {vms.map((vm) => (
            <li key={vm.harbor.id}>
              <HarborCard vm={vm} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

