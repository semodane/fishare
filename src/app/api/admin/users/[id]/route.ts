import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

const VALID_ROLES = ["OWNER", "ADMIN", "USER"] as const;

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.res;

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "Invalid body" } }, { status: 400 });

  const { role } = body;
  if (!VALID_ROLES.includes(role as typeof VALID_ROLES[number])) {
    return NextResponse.json({ ok: false, error: { code: "BAD_REQUEST", message: "유효하지 않은 역할입니다" } }, { status: 400 });
  }

  // OWNER는 OWNER만 설정 가능
  if (role === "OWNER" && admin.role !== "OWNER") {
    return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "소유자 권한은 소유자만 부여할 수 있습니다" } }, { status: 403 });
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { role: role as typeof VALID_ROLES[number] },
    select: { id: true, nickname: true, email: true, role: true }
  });

  return NextResponse.json({ ok: true, data: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.res;

  await prisma.user.update({
    where: { id: params.id },
    data: { status: "INACTIVE", deletedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
