import type { Boat } from "@/types/boat";
import type { Harbor } from "@/types/harbor";
import type { Place } from "@/types/place";
import type { Review } from "@/types/review";
import { MOCK_BOATS } from "./boats";
import { MOCK_HARBORS } from "./harbors";
import { MOCK_PLACES } from "./places";
import { MOCK_REVIEWS } from "./reviews";

export type FeaturedHarborItem = Harbor & { recentReviews: Review[] };

export type HomeMockData = {
  featuredHarbors: FeaturedHarborItem[];
  popularBoats: Boat[];
  recentReviews: Review[];
  nearbyPlaces: Place[];
};

export const MOCK_HOME: HomeMockData = {
  featuredHarbors: MOCK_HARBORS.filter((h) =>
    ["h_gunsan", "h_yeosu", "h_jeju", "h_tongyeong"].includes(h.id)
  ).map((h) => ({
    ...h,
    recentReviews: MOCK_REVIEWS.filter((r) => r.harborId === h.id).slice(0, 2)
  })),
  popularBoats: MOCK_BOATS,
  recentReviews: MOCK_REVIEWS.slice(0, 3),
  nearbyPlaces: MOCK_PLACES.filter((p) =>
    ["h_gunsan", "h_hongwonhang"].includes(p.harborId)
  )
};

