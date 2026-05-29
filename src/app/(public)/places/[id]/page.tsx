export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { CardBase } from "@/components/common/CardBase";
import {
  PlaceDetailActions,
  PlaceReviewsSection,
  PlaceSummaryCard,
  getPlaceDetailVM
} from "@/components/place";
import { getPlaceById } from "@/lib/queries/place";
import { getHarborById } from "@/lib/queries/harbor";
import { getReviewsByTarget } from "@/lib/queries/review";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const place = await getPlaceById(id);
  if (!place) notFound();

  const [harbor, reviews] = await Promise.all([
    getHarborById(place.harborId),
    getReviewsByTarget("place", place.id)
  ]);

  const harborName = harbor?.name ?? "항구";
  const vm = getPlaceDetailVM({ place, reviews });

  return (
    <MobilePageLayout
      headerVariant="back-title"
      title={place.name}
      backHref={harbor ? `/harbors/${harbor.id}` : "/harbors"}
    >
      <div className="space-y-5">
        <section className="space-y-3">
          <CardBase className="overflow-hidden">
            <div className="relative h-32 w-full bg-gradient-to-br from-neutral-100 via-sky-50 to-sky-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.22),transparent_55%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="inline-flex items-center rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-neutral-700 backdrop-blur">
                  {harborName}
                </div>
                <h1 className="mt-2 text-lg font-semibold tracking-tight">
                  {place.name}
                </h1>
                <p className="mt-1 text-sm text-neutral-700">
                  {vm.categoryLabel}
                </p>
              </div>
            </div>
          </CardBase>

          <PlaceDetailActions placeId={place.id} harborId={place.harborId} />
        </section>

        <PlaceSummaryCard vm={vm} harborName={harborName} />
        <PlaceReviewsSection reviews={reviews} />
      </div>
    </MobilePageLayout>
  );
}

