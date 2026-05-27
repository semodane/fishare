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
    <MobilePageLayout headerVariant="logo-search" activeTab="home">
      <ErrorState
        description="잠시 후 다시 시도해주세요."
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

