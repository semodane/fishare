import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function Loading() {
  return (
    <MobilePageLayout headerVariant="back-title" title="리뷰 작성" backHref="/">
      <LoadingSkeleton rows={5} />
    </MobilePageLayout>
  );
}

