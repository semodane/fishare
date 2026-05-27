import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function Loading() {
  return (
    <MobilePageLayout headerVariant="logo-search" activeTab="home">
      <LoadingSkeleton rows={4} />
    </MobilePageLayout>
  );
}

