import { prisma } from "@/lib/db";
import { HarborAddButton, HarborEditButton, HarborDeleteButton } from "@/components/admin/HarborFormModal";

export default async function AdminHarborsPage() {
  const harbors = await prisma.harbor.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, region: true, areaLabel: true,
      description: true, address: true, tags: true, mainSpecies: true,
      obsCode: true, status: true, reviewCount: true, createdAt: true,
      _count: { select: { boats: true, places: true } }
    }
  });

  const active = harbors.filter((h) => h.status === "ACTIVE").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-900">항구 관리</h1>
          <p className="text-sm text-neutral-500">활성 {active}개 / 전체 {harbors.length}개</p>
        </div>
        <HarborAddButton />
      </div>

      <div className="space-y-2">
        {harbors.map((h) => (
          <div
            key={h.id}
            className={`rounded-2xl border border-black/10 bg-white p-4 ${h.status === "INACTIVE" ? "opacity-40" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-neutral-900">{h.name}</span>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                    {h.areaLabel}
                  </span>
                  <span className="text-xs text-neutral-400">{h.region}</span>
                  {h.status === "INACTIVE" && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-500">비활성</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-neutral-500 line-clamp-1">{h.address}</p>
                <p className="mt-0.5 text-xs text-neutral-400 line-clamp-1">{h.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-400">
                  <span>선박 {h._count.boats}척</span>
                  <span>편의시설 {h._count.places}개</span>
                  <span>리뷰 {h.reviewCount}개</span>
                  {h.obsCode && (
                    <span className="text-sky-500">🌊 {h.obsCode}</span>
                  )}
                  {h.tags.length > 0 && (
                    <span className="text-neutral-300">
                      {h.tags.map((t) => `#${t}`).join(" ")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {h.status === "ACTIVE" && (
                  <>
                    <HarborEditButton harbor={{
                      id: h.id, name: h.name, region: h.region, areaLabel: h.areaLabel,
                      description: h.description, address: h.address, tags: h.tags,
                      mainSpecies: h.mainSpecies, obsCode: h.obsCode
                    }} />
                    <HarborDeleteButton harborId={h.id} />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
