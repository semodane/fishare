import { prisma } from "@/lib/db";
import { mapBoat, mapHarbor, mapPlace, mapTideInfo } from "./_map";
import type { Boat } from "@/types/boat";
import type { Harbor } from "@/types/harbor";
import type { Place } from "@/types/place";
import type { TideInfo } from "@/types/tide";

export async function getHarbors(): Promise<Harbor[]> {
  const rows = await prisma.harbor.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    orderBy: [{ name: "asc" }]
  });
  return rows.map(mapHarbor);
}

export async function getHarborById(harborId: string): Promise<Harbor | null> {
  const row = await prisma.harbor.findFirst({
    where: { id: harborId, status: "ACTIVE", deletedAt: null }
  });
  return row ? mapHarbor(row) : null;
}

export async function getHarborBoats(harborId: string): Promise<Boat[]> {
  const rows = await prisma.boat.findMany({
    where: { harborId, status: "ACTIVE", deletedAt: null },
    orderBy: [{ updatedAt: "desc" }]
  });
  return rows.map(mapBoat);
}

export async function getHarborPlaces(harborId: string): Promise<Place[]> {
  const rows = await prisma.place.findMany({
    where: { harborId, status: "ACTIVE", deletedAt: null },
    orderBy: [{ category: "asc" }, { updatedAt: "desc" }]
  });
  return rows.map(mapPlace);
}

export async function getHarborTides(harborId: string): Promise<TideInfo[]> {
  const rows = await prisma.tideInfo.findMany({
    where: { harborId, status: "ACTIVE", deletedAt: null },
    orderBy: [{ date: "desc" }],
    take: 10
  });
  return rows.map(mapTideInfo);
}
