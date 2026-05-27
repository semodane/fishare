import type { Place, PlaceCategory } from "@/types/place";
import type { Review } from "@/types/review";

export type PlaceSpecialInfo = Record<string, boolean | string>;

export type PlaceDetailVM = {
  place: Place;
  categoryLabel: string;
  specialInfo: PlaceSpecialInfo;
  reviewCount: number;
};

const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  tackle_shop: "낚시점",
  early_restaurant: "새벽식당",
  fish_cleaning: "손질",
  cooking_restaurant: "조리식당"
};

const DEFAULT_SPECIAL_INFO: Record<PlaceCategory, PlaceSpecialInfo> = {
  tackle_shop: { "미끼 판매": true, "장비 판매": true },
  early_restaurant: { "새벽 오픈": true, "아침식사 가능": true },
  fish_cleaning: { "손질 가능": true, "포장 가능": true },
  cooking_restaurant: { "요리 가능": true, "가족 적합": true }
};

export function getPlaceDetailVM(params: {
  place: Place;
  reviews: Review[];
}): PlaceDetailVM {
  const reviewCount = params.reviews.filter(
    (r) => r.targetType === "place" && r.targetId === params.place.id
  ).length;

  return {
    place: params.place,
    categoryLabel: CATEGORY_LABEL[params.place.category],
    specialInfo: DEFAULT_SPECIAL_INFO[params.place.category],
    reviewCount
  };
}

