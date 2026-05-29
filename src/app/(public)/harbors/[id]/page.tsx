export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { CardBase } from "@/components/common/CardBase";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  HarborBoatsSection,
  HarborPlacesSection,
} from "@/components/harbor";
import { TideSection } from "@/components/harbor/TideSection";
import { getHarborCardVM } from "@/components/harbor/harborView";
import {
  getHarborById,
  getHarborBoats,
  getHarborPlaces,
  getHarbors
} from "@/lib/queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HarborDetailPage({ params }: PageProps) {
  const { id } = await params;
  const harbor = await getHarborById(id);
  if (!harbor) notFound();

  const [boats, places, allHarbors] = await Promise.all([
    getHarborBoats(harbor.id),
    getHarborPlaces(harbor.id),
    getHarbors()
  ]);

  const vm = getHarborCardVM({ harbor, reviews: [] });

  return (
    <MobilePageLayout
      headerVariant="back-title"
      title={harbor.name}
      backHref="/harbors"
      activeTab="harbors"
    >
      <div className="space-y-5">
        <section className="space-y-3">
          <CardBase className="overflow-hidden">
            <div className="relative h-40 w-full bg-gradient-to-br from-sky-200 via-sky-100 to-neutral-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.25),transparent_55%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="inline-flex items-center rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-neutral-700 backdrop-blur">
                  {harbor.region} · {harbor.areaLabel}
                </div>
                <h1 className="mt-2 text-lg font-semibold tracking-tight">
                  {harbor.name}
                </h1>
              </div>
            </div>
          </CardBase>

        </section>

        <section className="space-y-3">
          <SectionHeader title="항구 요약" subtitle="한눈에 보는 핵심 정보" />
          <CardBase className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-neutral-50 p-3">
                <div className="text-[11px] font-medium text-neutral-600">
                  대표 어종
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {vm.representativeFish.slice(0, 2).join(" · ")}
                </div>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3">
                <div className="text-[11px] font-medium text-neutral-600">
                  선박 수
                </div>
                <div className="mt-1 text-sm font-semibold">{boats.length}척</div>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3">
                <div className="text-[11px] font-medium text-neutral-600">
                  초보 추천
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {vm.beginnerScore}/5
                </div>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3">
                <div className="text-[11px] font-medium text-neutral-600">
                  주소
                </div>
                <div className="mt-1 line-clamp-2 text-xs text-neutral-700">
                  {harbor.address}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {harbor.tags.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </CardBase>
        </section>

        <section className="space-y-3">
          <TideSection harborId={harbor.id} />
        </section>

        <HarborBoatsSection boats={boats} />
        <HarborPlacesSection places={places} />

        <section className="space-y-3">
          <SectionHeader title="다른 항구" subtitle="같이 둘러보기" />
          <div className="-mx-4 overflow-x-auto px-4">
            <div className="flex gap-3">
              {allHarbors
                .filter((h) => h.id !== harbor.id)
                .slice(0, 6)
                .map((h) => (
                  <Link
                    key={h.id}
                    href={`/harbors/${h.id}`}
                    className="w-[220px] shrink-0"
                  >
                    <CardBase className="p-4 active:bg-neutral-50">
                      <div className="text-sm font-semibold">{h.name}</div>
                      <div className="mt-0.5 text-xs text-neutral-600">
                        {h.region} · {h.areaLabel}
                      </div>
                      <div className="mt-2 line-clamp-2 text-sm text-neutral-700">
                        {h.description}
                      </div>
                    </CardBase>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>
    </MobilePageLayout>
  );
}

