"use client";

import Link from "next/link";

export function PlaceDetailActions({
  placeId,
  harborId
}: {
  placeId: string;
  harborId: string;
}) {
  return (
    <div className="space-y-2">
      <Link
        href={`/reviews/write?targetType=place&targetId=${encodeURIComponent(placeId)}`}
        className={[
          "inline-flex h-10 w-full items-center justify-center rounded-xl bg-sky-700 text-sm font-semibold text-white",
          "active:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        ].join(" ")}
        aria-label={`${placeId} 리뷰 작성으로 이동`}
      >
        리뷰 작성
      </Link>
      <Link
        href={`/harbors/${harborId}`}
        className="block text-center text-xs font-medium text-sky-700 hover:underline"
        aria-label={`${placeId} 소속 항구로 이동`}
      >
        항구 상세로 돌아가기
      </Link>
    </div>
  );
}
