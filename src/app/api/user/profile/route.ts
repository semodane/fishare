import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

function ok(data: unknown) {
  return NextResponse.json({ ok: true, data });
}

function fail(code: string, message: string, status = 400) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

/** GET /api/user/profile?checkNickname=xxx — 닉네임 사용 가능 여부 확인 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return fail("UNAUTHORIZED", "로그인이 필요합니다", 401);

  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get("checkNickname")?.trim() ?? "";

  if (!nickname) return fail("BAD_REQUEST", "닉네임을 입력해주세요", 400);
  if (nickname.length < 2 || nickname.length > 20)
    return ok({ available: false, reason: "닉네임은 2~20자여야 합니다" });

  const existing = await prisma.user.findFirst({
    where: { nickname, NOT: { id: session.user.id }, deletedAt: null }
  });

  return ok({ available: !existing });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return fail("UNAUTHORIZED", "로그인이 필요합니다", 401);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { status: "INACTIVE", deletedAt: new Date() }
  });

  return ok(null);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return fail("UNAUTHORIZED", "로그인이 필요합니다", 401);

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return fail("BAD_REQUEST", "Invalid body", 400);

  const data: { nickname?: string; image?: string | null } = {};

  if ("nickname" in body) {
    const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
    if (!nickname) return fail("BAD_REQUEST", "닉네임을 입력해주세요", 400);
    if (nickname.length < 2 || nickname.length > 20)
      return fail("BAD_REQUEST", "닉네임은 2~20자여야 합니다", 400);

    // 유니크 검사
    const dup = await prisma.user.findFirst({
      where: { nickname, NOT: { id: session.user.id }, deletedAt: null }
    });
    if (dup) return fail("CONFLICT", "이미 사용 중인 닉네임입니다", 409);

    data.nickname = nickname;
  }

  if ("image" in body) {
    const image = body.image;
    if (image === null || image === "") {
      data.image = null;
    } else if (typeof image === "string") {
      // base64 data URL 또는 https URL 허용
      const isDataUrl = image.startsWith("data:image/");
      const isHttpUrl = image.startsWith("https://") || image.startsWith("http://");
      if (!isDataUrl && !isHttpUrl)
        return fail("BAD_REQUEST", "올바른 이미지 형식이 아닙니다", 400);
      data.image = image;
    }
  }

  if (Object.keys(data).length === 0)
    return fail("BAD_REQUEST", "수정할 항목이 없습니다", 400);

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, nickname: true, image: true }
  });

  return ok({ nickname: updated.nickname, image: updated.image });
}
