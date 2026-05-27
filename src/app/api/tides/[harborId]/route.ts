import { prisma } from "@/lib/db";
import { fetchTidePredictions } from "@/lib/khoa";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ harborId: string }> }
) {
  const { harborId } = await params;

  const harbor = await prisma.harbor.findUnique({
    where: { id: harborId, status: "ACTIVE", deletedAt: null },
    select: { obsCode: true, name: true }
  });

  if (!harbor?.obsCode) {
    return NextResponse.json({ ok: false, data: null }, { status: 404 });
  }

  const result = await fetchTidePredictions(harbor.obsCode);
  if (!result) {
    return NextResponse.json({ ok: false, data: null }, { status: 503 });
  }

  return NextResponse.json({ ok: true, data: result });
}
