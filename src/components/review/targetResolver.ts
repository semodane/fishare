import type { ReviewTargetType } from "@/types/review";
import { getBoatById } from "@/lib/queries/boat";
import { getHarborById } from "@/lib/queries/harbor";
import { getPlaceById } from "@/lib/queries/place";

export type ReviewTargetDisplay = {
  title: string;
  subtitle: string;
  backHref: string;
};

export async function resolveTargetDisplay(params: {
  targetType: ReviewTargetType;
  targetId: string;
}): Promise<ReviewTargetDisplay | null> {
  const { targetType, targetId } = params;

  if (targetType === "harbor") {
    const h = await getHarborById(targetId);
    if (!h) return null;
    return {
      title: h.name,
      subtitle: `${h.region} · ${h.areaLabel}`,
      backHref: `/harbors/${h.id}`
    };
  }

  if (targetType === "boat") {
    const b = await getBoatById(targetId);
    if (!b) return null;
    const h = await getHarborById(b.harborId);
    return {
      title: b.name,
      subtitle: `${h?.name ?? b.departureHarborName} · ${b.operatorName}`,
      backHref: `/boats/${b.id}`
    };
  }

  const p = await getPlaceById(targetId);
  if (!p) return null;
  const h = await getHarborById(p.harborId);
  return {
    title: p.name,
    subtitle: `${h?.name ?? "항구"} · ${p.category}`,
    backHref: `/places/${p.id}`
  };
}

