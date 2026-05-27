import { PrismaClient, PlaceCategory, ReviewTargetType } from "@prisma/client";
import { MOCK_USERS } from "@/lib/mocks/users";
import { MOCK_HARBORS } from "@/lib/mocks/harbors";
import { MOCK_BOATS } from "@/lib/mocks/boats";
import { MOCK_PLACES } from "@/lib/mocks/places";
import { MOCK_TIDES } from "@/lib/mocks/tides";
import { MOCK_REVIEWS } from "@/lib/mocks/reviews";
import { TAG_OPTIONS } from "@/components/review/reviewTags";

const prisma = new PrismaClient();

function dateOnlyKST(date: string) {
  // Interpret YYYY-MM-DD as Asia/Seoul midnight to keep day stable.
  return new Date(`${date}T00:00:00+09:00`);
}

async function main() {
  // ---- Users (Auth.js compatible) ----
  for (const u of MOCK_USERS) {
    // seed용 이메일이 필요(Review FK authorId를 만족시키기 위함)
    const email = `${u.id}@fishare.local`;
    await prisma.user.upsert({
      where: { email },
      update: { name: u.name, image: u.imageUrl ?? null },
      create: {
        id: u.id,
        name: u.name,
        email,
        image: u.imageUrl ?? null
      }
    });
  }

  // ---- Harbors ----
  for (const h of MOCK_HARBORS) {
    await prisma.harbor.upsert({
      where: { id: h.id },
      update: {
        name: h.name,
        region: h.region,
        areaLabel: h.areaLabel,
        description: h.description,
        address: h.address,
        tags: h.tags
      },
      create: {
        id: h.id,
        name: h.name,
        region: h.region,
        areaLabel: h.areaLabel,
        description: h.description,
        address: h.address,
        tags: h.tags
      }
    });
  }

  // ---- Boats ----
  for (const b of MOCK_BOATS) {
    await prisma.boat.upsert({
      where: { id: b.id },
      update: {
        harborId: b.harborId,
        name: b.name,
        operatorName: b.operatorName,
        capacity: b.capacity,
        priceLabel: b.priceLabel,
        departureHarborName: b.departureHarborName,
        tags: b.tags,
        imageUrl: b.imageUrl ?? null,
        imageUrls: b.imageUrl ? [b.imageUrl] : undefined
      },
      create: {
        id: b.id,
        harborId: b.harborId,
        name: b.name,
        operatorName: b.operatorName,
        capacity: b.capacity,
        priceLabel: b.priceLabel,
        departureHarborName: b.departureHarborName,
        tags: b.tags,
        imageUrl: b.imageUrl ?? null,
        imageUrls: b.imageUrl ? [b.imageUrl] : undefined
      }
    });
  }

  // ---- Places ----
  for (const p of MOCK_PLACES) {
    await prisma.place.upsert({
      where: { id: p.id },
      update: {
        harborId: p.harborId,
        name: p.name,
        category: p.category as PlaceCategory,
        address: p.address,
        note: p.note ?? null,
        phone: p.phone ?? null,
        openHours: p.openHours ?? null
      },
      create: {
        id: p.id,
        harborId: p.harborId,
        name: p.name,
        category: p.category as PlaceCategory,
        address: p.address,
        note: p.note ?? null,
        phone: p.phone ?? null,
        openHours: p.openHours ?? null
      }
    });
  }

  // ---- TideInfo ----
  for (const t of MOCK_TIDES) {
    const date = dateOnlyKST(t.date);
    await prisma.tideInfo.upsert({
      where: { harborId_date: { harborId: t.harborId, date } },
      update: {
        timezone: t.timezone,
        sourceLabel: t.sourceLabel,
        summary: t.summary,
        tides: t.tides
      },
      create: {
        id: t.id,
        harborId: t.harborId,
        date,
        timezone: t.timezone,
        sourceLabel: t.sourceLabel,
        summary: t.summary,
        tides: t.tides
      }
    });
  }

  // ---- ReviewTagDefinition ----
  const tagDefByKey = new Map<string, { id: string }>();
  for (const [i, td] of TAG_OPTIONS.entries()) {
    const created = await prisma.reviewTagDefinition.upsert({
      where: { key: td.key },
      update: { label: td.label, order: i },
      create: { key: td.key, label: td.label, order: i }
    });
    tagDefByKey.set(td.key, { id: created.id });
  }

  // ---- Reviews (minimal) ----
  // mock 리뷰에 tags가 없어서 seed 단계에서 최소 태그를 부여합니다.
  const seededTags: Record<string, string[]> = {
    r_001: ["beginner_friendly", "good_facility"],
    r_002: ["kind_captain", "good_guidance"],
    r_003: ["clean_service"],
    r_004: ["good_value"]
  };

  for (const r of MOCK_REVIEWS) {
    await prisma.review.upsert({
      where: { id: r.id },
      update: {
        rating: r.rating,
        title: r.title,
        content: r.content,
        visitedAt: dateOnlyKST(r.visitedAt),
        images: r.images ?? [],
        tags: seededTags[r.id] ?? [],
        wouldRevisit: r.wouldRevisit ?? null,
        detailScores: r.detailScores ?? undefined
      },
      create: {
        id: r.id,
        authorId: r.authorId,
        harborId: r.harborId,
        targetType: r.targetType as ReviewTargetType,
        targetId: r.targetId,
        rating: r.rating,
        title: r.title,
        content: r.content,
        visitedAt: dateOnlyKST(r.visitedAt),
        images: r.images ?? [],
        tags: seededTags[r.id] ?? [],
        wouldRevisit: r.wouldRevisit ?? null,
        detailScores: r.detailScores ?? undefined,
        createdAt: new Date(r.createdAt)
      }
    });
  }

  // ---- ReviewTagMap (optional but useful) ----
  const tagMaps: Array<{ reviewId: string; tagId: string }> = [];
  for (const [reviewId, keys] of Object.entries(seededTags)) {
    for (const key of keys) {
      const def = tagDefByKey.get(key);
      if (!def) continue;
      tagMaps.push({ reviewId, tagId: def.id });
    }
  }
  if (tagMaps.length > 0) {
    await prisma.reviewTagMap.createMany({ data: tagMaps, skipDuplicates: true });
  }

  // ---- Cache columns (reviewAvg/reviewCount) ----
  // MVP seed에서는 Harbor만 간단히 갱신 (확장 시 Boat/Place도 동일 패턴)
  for (const harbor of MOCK_HARBORS) {
    const agg = await prisma.review.aggregate({
      where: { harborId: harbor.id, status: "ACTIVE", deletedAt: null },
      _avg: { rating: true },
      _count: { _all: true }
    });
    await prisma.harbor.update({
      where: { id: harbor.id },
      data: {
        reviewAvg: agg._avg.rating ?? 0,
        reviewCount: agg._count._all
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

