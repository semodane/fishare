import { prisma } from "@/lib/db";
import { mapBoat } from "./_map";
import type { Boat } from "@/types/boat";

export async function getBoats(): Promise<Boat[]> {
  const rows = await prisma.boat.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    orderBy: [{ departureHarborName: "asc" }, { name: "asc" }]
  });
  return rows.map(mapBoat);
}

export async function getBoatById(boatId: string): Promise<Boat | null> {
  const row = await prisma.boat.findFirst({
    where: { id: boatId, status: "ACTIVE", deletedAt: null }
  });
  return row ? mapBoat(row) : null;
}

