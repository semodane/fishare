import Link from "next/link";
import type { Boat } from "@/types/boat";
import { CardBase } from "@/components/common/CardBase";
import { SectionHeader } from "@/components/common/SectionHeader";

function MiniBoatIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        d="M4 16h16l-2 4H6l-2-4Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 3v9m0-9 4 3m-4-3-4 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 16h16l-2 4H6l-2-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomePopularBoatsSection({ boats }: { boats: Boat[] }) {
  return (
    <section className="space-y-3">
      <SectionHeader title="인기 선박" subtitle="후기가 많은 인기 출조를 모았어요" />

      <div className="space-y-2">
        {boats.map((b) => (
          <Link key={b.id} href={`/boats/${b.id}`} className="block">
            <CardBase className="p-4 active:bg-neutral-50">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <MiniBoatIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {b.name}
                      </div>
                      <div className="mt-0.5 text-xs text-neutral-600">
                        {b.departureHarborName} · {b.operatorName}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs font-semibold text-neutral-900">
                      {b.priceLabel}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {b.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700"
                      >
                        {t}
                      </span>
                    ))}
                    <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">
                      정원 {b.capacity}명
                    </span>
                  </div>
                </div>
              </div>
            </CardBase>
          </Link>
        ))}
      </div>
    </section>
  );
}

