import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.res;

  await prisma.review.update({
    where: { id: params.id },
    data: { status: "INACTIVE", deletedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
