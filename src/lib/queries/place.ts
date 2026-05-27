import { prisma } from "@/lib/db";
import { mapPlace } from "./_map";
import type { Place, PlaceCategory } from "@/types/place";

export async function getPlaces(): Promise<Place[]> {
  const rows = await prisma.place.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    orderBy: [{ harborId: "asc" }, { category: "asc" }, { name: "asc" }]
  });
  return rows.map(mapPlace);
}

export async function getPlaceById(placeId: string): Promise<Place | null> {
  const row = await prisma.place.findFirst({
    where: { id: placeId, status: "ACTIVE", deletedAt: null }
  });
  return row ? mapPlace(row) : null;
}

export const PLACE_CATEGORY_LABEL: Record<PlaceCategory, string> = {
  tackle_shop: "낚시용품점",
  early_restaurant: "새벽식당",
  fish_cleaning: "손질센터",
  cooking_restaurant: "즉석요리"
};

