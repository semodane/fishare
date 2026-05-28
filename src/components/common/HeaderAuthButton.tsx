"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

function AvatarIcon({ image, nickname }: { image?: string | null; nickname?: string | null }) {
  const initial = (nickname ?? "?")[0].toUpperCase();
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt="프로필"
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
      {initial}
    </span>
  );
}

export function HeaderAuthButton() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    const nickname = (session.user as { nickname?: string }).nickname ?? session.user.name;
    const image = (session.user as { image?: string | null }).image;
    return (
      <Link
        href="/my"
        aria-label="마이페이지"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white active:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <AvatarIcon image={image} nickname={nickname} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void signIn(undefined, { callbackUrl: "/" })}
      className="inline-flex h-9 items-center rounded-lg bg-sky-700 px-3 text-xs font-semibold text-white active:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
    >
      로그인
    </button>
  );
}
