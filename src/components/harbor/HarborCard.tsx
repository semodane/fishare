import Link from "next/link";
import { CardBase } from "@/components/common/CardBase";
import type { HarborCardVM } from "./harborView";

function BeginnerBar({ score }: { score: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-600">초보</span>
      <div className="h-2 w-20 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-sky-600"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-neutral-800">{score}/5</span>
    </div>
  );
}

export function HarborCard({ vm }: { vm: HarborCardVM }) {
  return (
    <Link href={`/harbors/${vm.harbor.id}`} className="block">
      <CardBase className="p-4 active:bg-neutral-50">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{vm.harbor.name}</div>
            <div className="mt-0.5 text-xs text-neutral-600">
              {vm.harbor.region} · {vm.harbor.areaLabel}
            </div>
          </div>
          <div className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">
            리뷰 {vm.reviewCount}
          </div>
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
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <BeginnerBar score={vm.beginnerScore} />
          <span className="text-xs font-medium text-sky-700">자세히</span>
        </div>
      </CardBase>
    </Link>
  );
}

