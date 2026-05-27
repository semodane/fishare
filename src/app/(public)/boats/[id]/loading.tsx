import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function Loading() {
  return (
    <MobilePageLayout headerVariant="back-title" title="선박 상세" backHref="/harbors">
      <LoadingSkeleton rows={4} />
    </MobilePageLayout>
  );
}

