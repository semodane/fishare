import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.res;

  const { id } = await params;

  await prisma.review.update({
    where: { id },
    data: { status: "INACTIVE", deletedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
