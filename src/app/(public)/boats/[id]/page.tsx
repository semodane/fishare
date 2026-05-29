export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { CardBase } from "@/components/common/CardBase";
import { BoatDetailActions, BoatInfoEditCard, BoatReviewsSection, BoatSummaryCard, getBoatDetailVM } from "@/components/boat";
import { getBoatById } from "@/lib/queries/boat";
import { getHarborById } from "@/lib/queries/harbor";
import { getReviewsByTarget } from "@/lib/queries/review";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BoatDetailPage({ params }: PageProps) {
  const { id } = await params;
  const boat = await getBoatById(id);
  if (!boat) notFound();

  const [harbor, reviews] = await Promise.all([
    getHarborById(boat.harborId),
    getReviewsByTarget("boat", boat.id)
  ]);

  const harborName = harbor?.name ?? boat.departureHarborName;
  const vm = getBoatDetailVM({ boat, reviews });

  return (
    <MobilePageLayout
      headerVariant="back-title"
      title={boat.name}
      backHref={harbor ? `/harbors/${harbor.id}` : "/harbors"}
    >
      <div className="space-y-5">
        <section className="space-y-3">
          <CardBase className="overflow-hidden">
            <div className="relative h-40 w-full bg-gradient-to-br from-sky-200 via-sky-100 to-neutral-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.25),transparent_55%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="inline-flex items-center rounded-full bg-white/80 px-2 py-1 text-[11px] font-medium text-neutral-700 backdrop-blur">
                  {harborName}
                </div>
                <h1 className="mt-2 text-lg font-semibold tracking-tight">
                  {boat.name}
                </h1>
                <p className="mt-1 text-sm text-neutral-700">
                  {[
                    boat.capacity > 1 ? `정원 ${boat.capacity}명` : null,
                    boat.priceLabel && boat.priceLabel !== "-" ? boat.priceLabel : null
                  ].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </CardBase>

          <BoatDetailActions boatId={boat.id} harborId={boat.harborId} />
        </section>

        <BoatSummaryCard vm={vm} harborName={harborName} />
        <BoatInfoEditCard boat={boat} />
        <BoatReviewsSection reviews={reviews} />
      </div>
    </MobilePageLayout>
  );
}

