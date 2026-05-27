import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { HarborListClient } from "@/components/harbor";
import { getHarbors } from "@/lib/queries/harbor";
import { getReviewsForHarbors } from "@/lib/queries/review";

export default async function HarborsPage() {
  const harbors = await getHarbors();
  const reviews = await getReviewsForHarbors(harbors.map((h) => h.id));
  return (
    <MobilePageLayout
      headerVariant="logo-search"
      activeTab="harbors"
      title="항구찾기"
    >
      <HarborListClient harbors={harbors} reviews={reviews} />
    </MobilePageLayout>
  );
}

