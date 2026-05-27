import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { mapBoat } from "@/lib/queries/_map";

function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}
function fail(code: string, message: string, status: number) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}
function str(v: unknown): v is string {
  return typeof v === "string" && (v as string).trim().length > 0;
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user && (session.user as { id?: string }).id;
  if (!userId) return fail("UNAUTHORIZED", "Login required", 401);

  const body = await req.json().catch(() => null);
  if (!body) return fail("BAD_REQUEST", "Invalid body", 400);

  const { harborId, name, operatorName, capacity, priceLabel, departureHarborName } = body;

  if (!str(harborId) || !str(name)) {
    return fail("BAD_REQUEST", "Required: harborId, name", 400);
  }

  const harbor = await prisma.harbor.findFirst({
    where: { id: harborId, status: "ACTIVE", deletedAt: null },
    select: { id: true }
  });
  if (!harbor) return fail("NOT_FOUND", "Harbor not found", 404);

  const { features } = body as { features?: { equipmentRental?: boolean; lifeJacketProvided?: boolean } };
  const featuresData = features
    ? { equipmentRental: features.equipmentRental ?? null, lifeJacketProvided: features.lifeJacketProvided ?? null }
    : undefined;

  const row = await prisma.boat.create({
    data: {
      harborId,
      name: name.trim(),
      operatorName: str(operatorName) ? (operatorName as string).trim() : "-",
      capacity: typeof capacity === "number" && capacity > 0 ? capacity : 1,
      priceLabel: str(priceLabel) ? (priceLabel as string).trim() : "-",
      departureHarborName: str(departureHarborName) ? (departureHarborName as string).trim() : "-",
      tags: [],
      ...(featuresData !== undefined ? { features: featuresData } : {})
    }
  });

  return ok({ item: mapBoat(row) }, { status: 201 });
}
