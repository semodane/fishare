import type { Review } from "@/types/review";

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r_001",
    authorId: "u_001",
    targetType: "harbor",
    targetId: "h_gunsan",
    harborId: "h_gunsan",
    rating: 4,
    title: "초보도 무난했던 군산항",
    content:
      "동선이 단순하고 편의시설이 가까워서 첫 출조에 부담이 적었어요. 물때 체크는 꼭 하고 가면 좋습니다.",
    visitedAt: "2026-04-06",
    createdAt: "2026-04-07T02:10:00.000Z",
    images: ["https://picsum.photos/seed/fishare-review-001/900/600"]
  },
  {
    id: "r_002",
    authorId: "u_002",
    targetType: "boat",
    targetId: "b_hongwon_01",
    harborId: "h_hongwonhang",
    rating: 5,
    title: "홍원 스피드호: 설명이 친절해요",
    content:
      "새벽 출항이라 준비가 걱정이었는데, 안내가 체계적이어서 편했습니다. 초보도 같이 타기 좋아요.",
    visitedAt: "2026-04-05",
    createdAt: "2026-04-06T01:20:00.000Z",
    images: ["https://picsum.photos/seed/fishare-review-002/900/600"]
  },
  {
    id: "r_003",
    authorId: "u_003",
    targetType: "place",
    targetId: "p_hongwon_clean_01",
    harborId: "h_hongwonhang",
    rating: 4,
    title: "손질센터 덕분에 귀가가 편했어요",
    content:
      "손질/포장 동선이 좋아서 차로 바로 실을 수 있었습니다. 혼잡 시간대만 피하면 만족도 높습니다.",
    visitedAt: "2026-04-05",
    createdAt: "2026-04-06T03:05:00.000Z"
  },
  {
    id: "r_004",
    authorId: "u_002",
    targetType: "harbor",
    targetId: "h_yeosu",
    harborId: "h_yeosu",
    rating: 5,
    title: "여수는 포인트가 다양해서 재방문 각",
    content:
      "바람만 받쳐주면 선택지가 많아서 좋아요. 출항지별로 분위기가 달라 다음엔 다른 선단도 타보고 싶네요.",
    visitedAt: "2026-04-02",
    createdAt: "2026-04-03T04:50:00.000Z"
  }
];

