import { prisma } from "@/lib/db";
import { mapReview } from "./_map";
import type { Review, ReviewTargetType } from "@/types/review";

export async function getReviewsByTarget(
  targetType: ReviewTargetType,
  targetId: string
): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { targetType, targetId, status: "ACTIVE", deletedAt: null },
    orderBy: [{ createdAt: "desc" }]
  });
  return rows.map(mapReview);
}

export async function getReviewsByUser(userId: string): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { authorId: userId, status: "ACTIVE", deletedAt: null },
    orderBy: [{ createdAt: "desc" }]
  });
  return rows.map(mapReview);
}

export async function getReviewsForHarbors(
  harborIds: string[]
): Promise<Review[]> {
  if (harborIds.length === 0) return [];
  const rows = await prisma.review.findMany({
    where: { harborId: { in: harborIds }, status: "ACTIVE", deletedAt: null },
    orderBy: [{ createdAt: "desc" }]
  });
  return rows.map(mapReview);
}
