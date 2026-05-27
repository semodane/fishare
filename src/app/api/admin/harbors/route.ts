import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.res;

  const harbors = await prisma.harbor.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, region: true, areaLabel: true,
      description: true, address: true, tags: true, mainSpecies: true,
      status: true, reviewCount: true, reviewAvg: true, createdAt: true,
      _count: { select: { boats: true, places: true } }
    }
  });

  return NextResponse.json({ ok: true, data: harbors });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.res;

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Invalid body" } }, { status: 400 });

  const { name, region, areaLabel, description, address, tags, mainSpecies } = body as Record<string, unknown>;

  if (!name || !region || !areaLabel || !description || !address) {
    return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "필수 항목을 입력해주세요" } }, { status: 400 });
  }

  const { obsCode } = body as Record<string, unknown>;

  const harbor = await prisma.harbor.create({
    data: {
      name: String(name).trim(),
      region: String(region).trim(),
      areaLabel: String(areaLabel).trim(),
      description: String(description).trim(),
      address: String(address).trim(),
      tags: Array.isArray(tags) ? tags.map(String) : [],
      mainSpecies: Array.isArray(mainSpecies) ? mainSpecies : (mainSpecies ? [mainSpecies] : undefined),
      obsCode: obsCode ? String(obsCode) : null
    }
  });

  return NextResponse.json({ ok: true, data: harbor }, { status: 201 });
}
