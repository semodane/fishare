import type { Boat } from "@/types/boat";
import { HARBOR_BY_ID } from "./harbors";

export const MOCK_BOATS: Boat[] = [
  {
    id: "b_gunsan_01",
    harborId: "h_gunsan",
    name: "군산 블루호",
    operatorName: "블루피싱",
    capacity: 12,
    priceLabel: "1인 12만원~",
    departureHarborName: HARBOR_BY_ID["h_gunsan"].name,
    tags: ["광어", "우럭", "초보환영"],
    imageUrl: "https://picsum.photos/seed/fishare-boat-01/800/600",
    updatedAt: "2026-04-09T06:00:00.000Z"
  },
  {
    id: "b_hongwon_01",
    harborId: "h_hongwonhang",
    name: "홍원 스피드호",
    operatorName: "홍원피싱",
    capacity: 10,
    priceLabel: "1인 11만원~",
    departureHarborName: HARBOR_BY_ID["h_hongwonhang"].name,
    tags: ["타이라바", "참돔", "새벽출항"],
    imageUrl: "https://picsum.photos/seed/fishare-boat-02/800/600",
    updatedAt: "2026-04-09T06:00:00.000Z"
  },
  {
    id: "b_yeosu_01",
    harborId: "h_yeosu",
    name: "여수 선샤인호",
    operatorName: "여수바다",
    capacity: 14,
    priceLabel: "1인 13만원~",
    departureHarborName: HARBOR_BY_ID["h_yeosu"].name,
    tags: ["갈치", "열기", "야간"],
    imageUrl: "https://picsum.photos/seed/fishare-boat-03/800/600",
    updatedAt: "2026-04-09T06:00:00.000Z"
  },
  {
    id: "b_jeju_01",
    harborId: "h_jeju",
    name: "제주 윈드호",
    operatorName: "제주낚시",
    capacity: 8,
    priceLabel: "1인 15만원~",
    departureHarborName: HARBOR_BY_ID["h_jeju"].name,
    tags: ["부시리", "지깅", "기상확인"],
    imageUrl: "https://picsum.photos/seed/fishare-boat-04/800/600",
    updatedAt: "2026-04-09T06:00:00.000Z"
  }
];

