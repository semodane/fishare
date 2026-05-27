"use client";

import { useEffect } from "react";
import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { ErrorState } from "@/components/common/ErrorState";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <MobilePageLayout headerVariant="logo-search" activeTab="harbors" title="항구찾기">
      <ErrorState
        description="항구 목록을 불러오지 못했어요."
        action={
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white active:bg-sky-800"
          >
            다시 시도
          </button>
        }
      />
    </MobilePageLayout>
  );
}

