import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { CardBase } from "@/components/common/CardBase";
import {
  ReviewWriteForm,
  ReviewTargetSelector,
  targetFromQuery,
  resolveTargetDisplay
} from "@/components/review";
import { getHarbors } from "@/lib/queries/harbor";
import { getBoats } from "@/lib/queries/boat";
import { getPlaces } from "@/lib/queries/place";
import { prisma } from "@/lib/db";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReviewWritePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const targetTypeRaw =
    typeof sp?.targetType === "string" ? sp.targetType : null;
  const targetIdRaw =
    typeof sp?.targetId === "string" ? sp.targetId : null;

  const t = targetFromQuery({ targetType: targetTypeRaw, targetId: targetIdRaw });
  const display = t ? await resolveTargetDisplay(t) : null;

  // 선박 리뷰 작성 시 현재 features 조회
  const boatFeatures =
    t?.targetType === "boat"
      ? await prisma.boat.findUnique({
          where: { id: t.targetId },
          select: { features: true }
        }).then((b) => (b?.features as { equipmentRental?: boolean | null; lifeJacketProvided?: boolean | null } | null) ?? null)
      : null;

  // 대상이 정해지지 않은 경우 → 선택 화면
  if (!t) {
    const [harbors, boats, places] = await Promise.all([
      getHarbors(),
      getBoats(),
      getPlaces()
    ]);
    return (
      <MobilePageLayout
        headerVariant="back-title"
        title="리뷰 작성"
        backHref="/"
        activeTab="review_write"
      >
        <ReviewTargetSelector harbors={harbors} boats={boats} places={places} />
      </MobilePageLayout>
    );
  }

  return (
    <MobilePageLayout
      headerVariant="back-title"
      title="리뷰 작성"
      backHref={display?.backHref ?? "/"}
      activeTab="review_write"
    >
      <div className="space-y-4">
        <CardBase className="p-4">
          <h1 className="text-base font-semibold">리뷰 작성</h1>
          <p className="mt-1 text-sm text-neutral-600">
            대상 유형에 따라 입력 항목이 달라집니다.
          </p>
        </CardBase>

        <ReviewWriteForm
          target={
            t && display
              ? {
                  targetType: t.targetType,
                  targetId: t.targetId,
                  title: display.title,
                  subtitle: display.subtitle,
                  backHref: display.backHref
                }
              : null
          }
          initialBoatFeatures={boatFeatures}
        />
      </div>
    </MobilePageLayout>
  );
}
