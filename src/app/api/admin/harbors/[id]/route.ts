import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.res;

  const { id } = await params;
  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Invalid body" } }, { status: 400 });

  const data: Record<string, unknown> = {};
  const fields = ["name", "region", "areaLabel", "description", "address"] as const;
  for (const f of fields) {
    if (f in body && typeof body[f] === "string") data[f] = String(body[f]).trim();
  }
  if ("tags" in body && Array.isArray(body.tags)) data.tags = body.tags.map(String);
  if ("mainSpecies" in body) data.mainSpecies = body.mainSpecies;
  if ("obsCode" in body) data.obsCode = body.obsCode ? String(body.obsCode) : null;

  const harbor = await prisma.harbor.update({
    where: { id },
    data
  });

  return NextResponse.json({ ok: true, data: harbor });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.res;

  const { id } = await params;

  await prisma.harbor.update({
    where: { id },
    data: { status: "INACTIVE", deletedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
