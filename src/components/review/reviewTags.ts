import type { ReviewTagKey, ReviewTargetType } from "@/types/review";

export type ReviewTagOption = { key: ReviewTagKey; label: string };

export const TAG_OPTIONS: ReviewTagOption[] = [
  { key: "beginner_friendly", label: "초보 친화" },
  { key: "kind_captain", label: "친절한 선장" },
  { key: "good_facility", label: "편의시설 좋음" },
  { key: "clean_service", label: "손질 만족" },
  { key: "good_value", label: "가성비" },
  { key: "good_guidance", label: "안내 만족" },
  { key: "good_food", label: "맛집" }
];

export function tagsForTarget(targetType: ReviewTargetType): ReviewTagOption[] {
  switch (targetType) {
    case "harbor":
      return TAG_OPTIONS.filter((t) =>
        ["beginner_friendly", "good_facility", "good_value", "good_guidance"].includes(
          t.key
        )
      );
    case "boat":
      return TAG_OPTIONS.filter((t) =>
        ["kind_captain", "good_guidance", "good_value"].includes(t.key)
      );
    case "place":
      return TAG_OPTIONS.filter((t) =>
        ["clean_service", "good_food", "good_value"].includes(t.key)
      );
    default: {
      const _exhaustive: never = targetType;
      return _exhaustive;
    }
  }
}

