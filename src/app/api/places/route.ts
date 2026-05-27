import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { mapPlace } from "@/lib/queries/_map";
import type { PlaceCategory as DbPlaceCategory } from "@prisma/client";

function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}
function fail(code: string, message: string, status: number) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}
function str(v: unknown): v is string {
  return typeof v === "string" && (v as string).trim().length > 0;
}

const VALID_CATEGORIES = new Set<string>([
  "tackle_shop",
  "early_restaurant",
  "fish_cleaning",
  "cooking_restaurant"
]);

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user && (session.user as { id?: string }).id;
  if (!userId) return fail("UNAUTHORIZED", "Login required", 401);

  const body = await req.json().catch(() => null);
  if (!body) return fail("BAD_REQUEST", "Invalid body", 400);

  const { harborId, name, category, address } = body;

  if (!str(harborId) || !str(name) || !str(category)) {
    return fail("BAD_REQUEST", "Required: harborId, name, category", 400);
  }
  if (!VALID_CATEGORIES.has(category)) {
    return fail("BAD_REQUEST", "Invalid category", 400);
  }

  const harbor = await prisma.harbor.findFirst({
    where: { id: harborId, status: "ACTIVE", deletedAt: null },
    select: { id: true }
  });
  if (!harbor) return fail("NOT_FOUND", "Harbor not found", 404);

  const row = await prisma.place.create({
    data: {
      harborId,
      name: name.trim(),
      category: category as DbPlaceCategory,
      address: str(address) ? (address as string).trim() : "-",
      note: str(body.note) ? (body.note as string).trim() : null,
      phone: str(body.phone) ? (body.phone as string).trim() : null,
      openHours: str(body.openHours) ? (body.openHours as string).trim() : null
    }
  });

  return ok({ item: mapPlace(row) }, { status: 201 });
}
