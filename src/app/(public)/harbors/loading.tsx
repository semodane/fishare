import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { CardBase } from "@/components/common/CardBase";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

export default function Loading() {
  return (
    <MobilePageLayout headerVariant="logo-search" activeTab="harbors" title="항구찾기">
      <div className="space-y-4">
        <CardBase className="p-4">
          <div className="h-4 w-24 rounded bg-neutral-200" />
          <div className="mt-2 h-3 w-56 rounded bg-neutral-100" />
        </CardBase>
        <LoadingSkeleton rows={4} />
      </div>
    </MobilePageLayout>
  );
}

