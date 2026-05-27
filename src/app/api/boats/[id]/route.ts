import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { mapBoat } from "@/lib/queries/_map";

function ok<T>(data: T) {
  return NextResponse.json({ ok: true, data });
}
function fail(code: string, message: string, status: number) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}
function str(v: unknown): v is string {
  return typeof v === "string" && (v as string).trim().length > 0;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user && (session.user as { id?: string }).id;
  if (!userId) return fail("UNAUTHORIZED", "Login required", 401);

  const { id } = await params;
  const boat = await prisma.boat.findFirst({
    where: { id, status: "ACTIVE", deletedAt: null }
  });
  if (!boat) return fail("NOT_FOUND", "Boat not found", 404);

  const body = await req.json().catch(() => null);
  if (!body) return fail("BAD_REQUEST", "Invalid body", 400);

  const data: Record<string, unknown> = {};
  if (str(body.operatorName)) data.operatorName = (body.operatorName as string).trim();
  if (str(body.priceLabel))   data.priceLabel   = (body.priceLabel as string).trim();
  if (typeof body.capacity === "number" && body.capacity > 0) data.capacity = body.capacity;
  if (str(body.contact))      data.contact    = (body.contact    as string).trim();
  if (str(body.bookingUrl))   data.bookingUrl  = (body.bookingUrl  as string).trim();
  if (body.features && typeof body.features === "object") {
    const f = body.features as { equipmentRental?: boolean | null; lifeJacketProvided?: boolean | null };
    const existing = (boat.features as Record<string, unknown> | null) ?? {};
    data.features = {
      ...existing,
      ...(f.equipmentRental !== undefined ? { equipmentRental: f.equipmentRental } : {}),
      ...(f.lifeJacketProvided !== undefined ? { lifeJacketProvided: f.lifeJacketProvided } : {})
    };
  }

  if (Object.keys(data).length === 0) {
    return fail("BAD_REQUEST", "No valid fields to update", 400);
  }

  const updated = await prisma.boat.update({ where: { id }, data });
  return ok({ item: mapBoat(updated) });
}
