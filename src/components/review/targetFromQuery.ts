import type { ReviewTargetType } from "@/types/review";

function isTargetType(v: string | null): v is ReviewTargetType {
  return v === "harbor" || v === "boat" || v === "place";
}

export function targetFromQuery(params: {
  targetType: string | null;
  targetId: string | null;
}): { targetType: ReviewTargetType; targetId: string } | null {
  if (!isTargetType(params.targetType)) return null;
  if (!params.targetId) return null;
  return { targetType: params.targetType, targetId: params.targetId };
}

