import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { prisma } from "@/lib/db";
import type { Prisma, ReviewTargetType as DbReviewTargetType } from "@prisma/client";
import type { CreateReviewInput, Review, ReviewTagKey, ReviewTargetType } from "@/types/review";
import { mapReview } from "@/lib/queries/_map";
import { TAG_OPTIONS } from "@/components/review/reviewTags";

function isScore5(v: unknown): v is 1 | 2 | 3 | 4 | 5 {
  return v === 1 || v === 2 || v === 3 || v === 4 || v === 5;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isDateYYYYMMDD(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function dateOnlyKST(date: string) {
  return new Date(`${date}T00:00:00+09:00`);
}

type ApiErrorCode = "UNAUTHORIZED" | "BAD_REQUEST" | "NOT_FOUND" | "INTERNAL";
function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}
function fail(code: ApiErrorCode, message: string, status: number) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

function getUserId(session: Session | null): string | null {
  const id = session?.user && (session.user as { id?: string }).id;
  return id ?? null;
}

async function resolveHarborId(params: {
  targetType: ReviewTargetType;
  targetId: string;
}): Promise<string | null> {
  const { targetType, targetId } = params;
  if (targetType === "harbor") {
    const h = await prisma.harbor.findFirst({
      where: { id: targetId, status: "ACTIVE", deletedAt: null },
      select: { id: true }
    });
    return h?.id ?? null;
  }
  if (targetType === "boat") {
    const b = await prisma.boat.findFirst({
      where: { id: targetId, status: "ACTIVE", deletedAt: null },
      select: { harborId: true }
    });
    return b?.harborId ?? null;
  }
  const p = await prisma.place.findFirst({
    where: { id: targetId, status: "ACTIVE", deletedAt: null },
    select: { harborId: true }
  });
  return p?.harborId ?? null;
}

async function ensureTagDefinitions(keys: ReviewTagKey[]) {
  if (keys.length === 0) return [];
  const unique = Array.from(new Set(keys));
  const existing = await prisma.reviewTagDefinition.findMany({
    where: { key: { in: unique } },
    select: { id: true, key: true }
  });
  const existingKeys = new Set(existing.map((x) => x.key));

  const labelByKey = new Map(TAG_OPTIONS.map((t, i) => [t.key, { label: t.label, order: i }]));
  const missing = unique.filter((k) => !existingKeys.has(k));

  if (missing.length > 0) {
    await prisma.reviewTagDefinition.createMany({
      data: missing.map((k) => {
        const meta = labelByKey.get(k);
        return {
          key: k,
          label: meta?.label ?? k,
          order: meta?.order ?? 0
        };
      }),
      skipDuplicates: true
    });
  }

  return prisma.reviewTagDefinition.findMany({
    where: { key: { in: unique } },
    select: { id: true, key: true }
  });
}

async function recalcCaches(params: {
  harborId: string;
  targetType: ReviewTargetType;
  targetId: string;
}) {
  const { harborId, targetType, targetId } = params;
  await prisma.$transaction(async (tx) => {
    const harborAgg = await tx.review.aggregate({
      where: { harborId, status: "ACTIVE", deletedAt: null },
      _avg: { rating: true },
      _count: { _all: true }
    });
    await tx.harbor.update({
      where: { id: harborId },
      data: {
        reviewAvg: harborAgg._avg.rating ?? 0,
        reviewCount: harborAgg._count._all
      }
    });

    if (targetType === "boat") {
      const agg = await tx.review.aggregate({
        where: { targetType: "boat", targetId, status: "ACTIVE", deletedAt: null },
        _avg: { rating: true },
        _count: { _all: true }
      });
      await tx.boat.update({
        where: { id: targetId },
        data: { reviewAvg: agg._avg.rating ?? 0, reviewCount: agg._count._all }
      });
    } else if (targetType === "place") {
      const agg = await tx.review.aggregate({
        where: { targetType: "place", targetId, status: "ACTIVE", deletedAt: null },
        _avg: { rating: true },
        _count: { _all: true }
      });
      await tx.place.update({
        where: { id: targetId },
        data: { reviewAvg: agg._avg.rating ?? 0, reviewCount: agg._count._all }
      });
    }
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const targetType = url.searchParams.get("targetType") as ReviewTargetType | null;
  const targetId = url.searchParams.get("targetId");
  const harborId = url.searchParams.get("harborId");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "30") || 30, 100);

  const where: Prisma.ReviewWhereInput = { status: "ACTIVE", deletedAt: null };
  if (harborId) where.harborId = harborId;
  if (targetType && targetId) {
    where.targetType = targetType as unknown as DbReviewTargetType;
    where.targetId = targetId;
  }

  const rows = await prisma.review.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: limit
  });
  return ok({ items: rows.map(mapReview) });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = getUserId(session);
  if (!userId) return fail("UNAUTHORIZED", "Login required", 401);

  const body = (await req.json().catch(() => null)) as CreateReviewInput | null;
  if (!body) return fail("BAD_REQUEST", "Invalid body", 400);

  if (
    (body.targetType !== "boat" && body.targetType !== "place") ||
    !isNonEmptyString(body.targetId) ||
    !isScore5(body.rating) ||
    !Array.isArray(body.tags) ||
    !isNonEmptyString(body.title) ||
    !isNonEmptyString(body.content) ||
    typeof body.wouldRevisit !== "boolean" ||
    !isDateYYYYMMDD(body.visitedAt)
  ) {
    return fail("BAD_REQUEST", "Validation failed", 400);
  }

  const harborId = await resolveHarborId({
    targetType: body.targetType,
    targetId: body.targetId
  });
  if (!harborId) return fail("NOT_FOUND", "Target not found", 404);

  const tagKeys = body.tags.filter((t): t is ReviewTagKey => typeof t === "string");
  const defs = await ensureTagDefinitions(tagKeys);

  const created = await prisma.review.create({
    data: {
      authorId: userId,
      harborId,
      targetType: body.targetType as unknown as DbReviewTargetType,
      targetId: body.targetId,
      rating: body.rating,
      title: body.title.trim(),
      content: body.content.trim(),
      visitedAt: dateOnlyKST(body.visitedAt),
      images: body.images ?? [],
      tags: tagKeys,
      detailScores: body.detailScores as unknown as Prisma.InputJsonValue,
      wouldRevisit: body.wouldRevisit
    }
  });

  if (defs.length > 0) {
    await prisma.reviewTagMap.createMany({
      data: defs.map((d) => ({ reviewId: created.id, tagId: d.id })),
      skipDuplicates: true
    });
  }

  await recalcCaches({
    harborId,
    targetType: body.targetType,
    targetId: body.targetId
  });

  const row = await prisma.review.findFirst({ where: { id: created.id } });
  if (!row) return fail("INTERNAL", "Failed to load created review", 500);
  return ok({ item: mapReview(row) }, { status: 201 });
}

