"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewDeleteButton({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handle() {
    if (!confirm("이 리뷰를 삭제(비활성화)하시겠습니까?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handle()}
      disabled={busy}
      className="rounded-lg border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {busy ? "삭제 중…" : "삭제"}
    </button>
  );
}
