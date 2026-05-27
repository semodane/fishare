export type ReviewTargetType = "harbor" | "boat" | "place";

export type Score5 = 1 | 2 | 3 | 4 | 5;

export type ReviewTagKey =
  | "beginner_friendly"
  | "kind_captain"
  | "good_facility"
  | "clean_service"
  | "good_value"
  | "good_guidance"
  | "good_food";

export type HarborDetailScores = {
  accessibility: Score5;
  convenience: Score5;
  overall: Score5;
};

export type BoatDetailScores = {
  captainKindness: Score5;
  cleanliness: Score5;
  restroomCleanliness: Score5;
  beginnerFriendly: Score5;
  guidanceSatisfaction: Score5;
};

export type PlaceDetailScores = {
  kindness: Score5;
  priceSatisfaction: Score5;
  quality: Score5;
  convenience: Score5;
};

export type Review = {
  id: string;
  authorId: string;
  targetType: ReviewTargetType;
  targetId: string;
  harborId: string; // 하버 중심으로 묶기 위한 정규화 키
  rating: Score5;
  title: string;
  content: string;
  visitedAt: string; // YYYY-MM-DD
  createdAt: string; // ISO
  images?: string[];
  tags?: ReviewTagKey[];
  wouldRevisit?: boolean;
  detailScores?: HarborDetailScores | BoatDetailScores | PlaceDetailScores;
};

export type CreateReviewInput = {
  targetType: ReviewTargetType;
  targetId: string;
  rating: Score5;
  tags: string[]; // boat: 자유 입력, 나머지: ReviewTagKey[]
  detailScores?: HarborDetailScores | BoatDetailScores | PlaceDetailScores;
  title: string; // 한줄평
  content: string;
  wouldRevisit: boolean;
  visitedAt: string; // YYYY-MM-DD
  images?: string[]; // placeholder
};

