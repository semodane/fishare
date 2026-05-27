"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function MyPageActions() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleWithdraw() {
    setDeleting(true);
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" });
      const json = await res.json() as { ok: boolean };
      if (json.ok) {
        await signOut({ callbackUrl: "/" });
      }
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* 로그아웃 */}
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/" })}
        className="w-full rounded-xl border border-black/10 bg-white py-3 text-sm font-semibold text-neutral-800 active:bg-neutral-50"
      >
        로그아웃
      </button>

      {/* 회원탈퇴 */}
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="w-full py-2 text-xs font-medium text-neutral-400 hover:text-red-500 active:text-red-600"
        >
          회원탈퇴
        </button>
      ) : (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-red-700">정말 탈퇴하시겠어요?</p>
          <p className="text-xs text-red-600 leading-relaxed">
            계정이 비활성화됩니다. 작성하신 리뷰는 그대로 유지됩니다.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void handleWithdraw()}
              disabled={deleting}
              className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white active:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "처리 중…" : "탈퇴하기"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-xl border border-black/10 bg-white py-2.5 text-sm font-medium text-neutral-600 active:bg-neutral-50"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
