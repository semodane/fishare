"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserDeactivateButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handle() {
    if (!confirm("이 회원을 비활성화하시겠습니까?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
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
      {busy ? "처리 중…" : "비활성화"}
    </button>
  );
}
