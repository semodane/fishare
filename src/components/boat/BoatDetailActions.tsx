"use client";

import Link from "next/link";

export function BoatDetailActions({
  boatId,
  harborId
}: {
  boatId: string;
  harborId: string;
}) {
  return (
    <div className="space-y-2">
      <Link
        href={`/reviews/write?targetType=boat&targetId=${encodeURIComponent(boatId)}`}
        className={[
          "inline-flex h-10 w-full items-center justify-center rounded-xl bg-sky-700 text-sm font-semibold text-white",
          "active:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        ].join(" ")}
        aria-label={`${boatId} 리뷰 작성으로 이동`}
      >
        리뷰 작성
      </Link>
    </div>
  );
}

