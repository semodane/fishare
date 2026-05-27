import { prisma } from "@/lib/db";
import type { HomeMockData, FeaturedHarborItem } from "@/lib/mocks/home";
import { mapBoat, mapHarbor, mapPlace, mapReview } from "./_map";

export async function getHomeData(): Promise<HomeMockData> {
  // 최근 boat/place 리뷰를 기준으로 harborId 순서를 뽑아 항구 우선순위 결정
  const recentHarborActivity = await prisma.review.findMany({
    where: {
      status: "ACTIVE",
      deletedAt: null,
      targetType: { in: ["boat", "place"] }
    },
    orderBy: [{ createdAt: "desc" }],
    take: 60,
    select: { harborId: true, id: true, targetType: true, targetId: true,
              rating: true, title: true, content: true, visitedAt: true,
              createdAt: true, authorId: true, images: true, tags: true,
              wouldRevisit: true, detailScores: true }
  });

  // 항구별 최근 리뷰 2개씩 모으기 (출현 순서 = 최근 활동 순)
  const reviewsByHarbor = new Map<string, typeof recentHarborActivity>();
  for (const r of recentHarborActivity) {
    const list = reviewsByHarbor.get(r.harborId) ?? [];
    if (list.length < 2) list.push(r);
    reviewsByHarbor.set(r.harborId, list);
  }

  // 최근 리뷰 있는 harborId 순서 (중복 제거)
  const orderedByActivity = [...new Set(recentHarborActivity.map((r) => r.harborId))];

  // 해당 항구들 fetch
  const activeHarborIds = orderedByActivity.slice(0, 10);
  const [harborsWithActivity, fallbackHarbors] = await Promise.all([
    activeHarborIds.length > 0
      ? prisma.harbor.findMany({
          where: { id: { in: activeHarborIds }, status: "ACTIVE", deletedAt: null }
        })
      : Promise.resolve([]),
    // 리뷰 없는 항구로 6개 채우기
    prisma.harbor.findMany({
      where: {
        status: "ACTIVE",
        deletedAt: null,
        ...(activeHarborIds.length > 0 ? { id: { notIn: activeHarborIds } } : {})
      },
      orderBy: [{ updatedAt: "desc" }],
      take: Math.max(0, 10 - activeHarborIds.length)
    })
  ]);

  // 활동 순서로 정렬 후 fallback 항구 이어붙이기
  const sortedWithActivity = activeHarborIds
    .map((id) => harborsWithActivity.find((h) => h.id === id))
    .filter((h): h is NonNullable<typeof h> => !!h);

  const featuredHarborsRaw = [...sortedWithActivity, ...fallbackHarbors].slice(0, 10);

  const featuredHarbors: FeaturedHarborItem[] = featuredHarborsRaw.map((h) => ({
    ...mapHarbor(h),
    recentReviews: (reviewsByHarbor.get(h.id) ?? []).map(mapReview)
  }));

  const [popularBoatsRaw, recentReviewsRaw, nearbyPlacesRaw] = await Promise.all([
    prisma.boat.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: [{ reviewCount: "desc" }, { updatedAt: "desc" }],
      take: 10
    }),
    prisma.review.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: [{ createdAt: "desc" }],
      take: 6
    }),
    prisma.place.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: [{ reviewCount: "desc" }, { updatedAt: "desc" }],
      take: 8
    })
  ]);

  return {
    featuredHarbors,
    popularBoats: popularBoatsRaw.map(mapBoat),
    recentReviews: recentReviewsRaw.map(mapReview),
    nearbyPlaces: nearbyPlacesRaw.map(mapPlace)
  };
}
