import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function Loading() {
  return (
    <MobilePageLayout headerVariant="back-title" title="항구 상세" backHref="/harbors" activeTab="harbors">
      <LoadingSkeleton rows={5} />
    </MobilePageLayout>
  );
}

