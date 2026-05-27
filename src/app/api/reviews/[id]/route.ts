import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { mapReview } from "@/lib/queries/_map";

type ApiErrorCode = "UNAUTHORIZED" | "NOT_FOUND" | "NOT_IMPLEMENTED";
function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}
function fail(code: ApiErrorCode, message: string, status: number) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const row = await prisma.review.findFirst({
    where: { id, status: "ACTIVE", deletedAt: null }
  });
  if (!row) return fail("NOT_FOUND", "Review not found", 404);
  return ok({ item: mapReview(row) });
}

export async function DELETE(
  _req: Request,
  _ctx: { params: Promise<{ id: string }> }
) {
  // MVP: 구조만 열어두고, 실제 삭제는 다음 단계에서.
  const session = await auth();
  const userId = session?.user && (session.user as { id?: string }).id;
  if (!userId) return fail("UNAUTHORIZED", "Login required", 401);
  return fail("NOT_IMPLEMENTED", "Not implemented in MVP", 501);
}

