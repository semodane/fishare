import type { Boat } from "@/types/boat";
import type { Review } from "@/types/review";

export type Score5 = 1 | 2 | 3 | 4 | 5;

export type BoatDetailVM = {
  boat: Boat;
  representativeFish: string[];
  scores: {
    condition: Score5;
    captainKindness: Score5;
    restroomCleanliness: Score5;
    beginnerFriendly: Score5;
    guidanceSatisfaction: Score5;
  };
  features: {
    equipmentRental: boolean;
    lifeJacketProvided: boolean;
  };
  reviewCount: number;
};

const BOAT_META: Record<
  string,
  {
    representativeFish: string[];
    scores: BoatDetailVM["scores"];
    features: BoatDetailVM["features"];
  }
> = {
  b_gunsan_01: {
    representativeFish: ["광어", "우럭", "쭈꾸미"],
    scores: {
      condition: 4,
      captainKindness: 5,
      restroomCleanliness: 4,
      beginnerFriendly: 5,
      guidanceSatisfaction: 4
    },
    features: { equipmentRental: true, lifeJacketProvided: true }
  },
  b_hongwon_01: {
    representativeFish: ["참돔", "광어", "우럭"],
    scores: {
      condition: 4,
      captainKindness: 5,
      restroomCleanliness: 3,
      beginnerFriendly: 4,
      guidanceSatisfaction: 5
    },
    features: { equipmentRental: true, lifeJacketProvided: true }
  },
  b_yeosu_01: {
    representativeFish: ["갈치", "열기", "참돔"],
    scores: {
      condition: 5,
      captainKindness: 4,
      restroomCleanliness: 4,
      beginnerFriendly: 4,
      guidanceSatisfaction: 4
    },
    features: { equipmentRental: false, lifeJacketProvided: true }
  },
  b_jeju_01: {
    representativeFish: ["부시리", "방어", "참돔"],
    scores: {
      condition: 4,
      captainKindness: 4,
      restroomCleanliness: 3,
      beginnerFriendly: 3,
      guidanceSatisfaction: 4
    },
    features: { equipmentRental: false, lifeJacketProvided: true }
  }
};

export function getBoatDetailVM(params: {
  boat: Boat;
  reviews: Review[];
}): BoatDetailVM {
  const meta = BOAT_META[params.boat.id] ?? {
    representativeFish: ["대표 어종"],
    scores: {
      condition: 4 as Score5,
      captainKindness: 4 as Score5,
      restroomCleanliness: 3 as Score5,
      beginnerFriendly: 3 as Score5,
      guidanceSatisfaction: 4 as Score5
    },
    features: { equipmentRental: false, lifeJacketProvided: true }
  };

  const reviewCount = params.reviews.filter(
    (r) => r.targetType === "boat" && r.targetId === params.boat.id
  ).length;

  return {
    boat: params.boat,
    representativeFish: meta.representativeFish,
    scores: meta.scores,
    features: meta.features,
    reviewCount
  };
}

