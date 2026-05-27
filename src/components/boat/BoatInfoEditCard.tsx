"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Boat } from "@/types/boat";
import { CardBase } from "@/components/common/CardBase";

const inputCls =
  "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-400";

function dash(v: string | undefined) {
  return !v || v === "-" ? "미입력" : v;
}

export function BoatInfoEditCard({ boat }: { boat: Boat }) {
  const router = useRouter();
  const [editing, setEditing]       = useState(false);
  const [contact, setContact]       = useState(boat.contact    ?? "");
  const [bookingUrl, setBookingUrl] = useState(boat.bookingUrl ?? "");
  const [priceLabel, setPriceLabel] = useState(boat.priceLabel === "-" ? "" : boat.priceLabel);
  const [capacity, setCapacity]     = useState(String(boat.capacity));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function save() {
    setError(null);
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {};
      if (contact.trim())    body.contact    = contact.trim();
      if (bookingUrl.trim()) body.bookingUrl = bookingUrl.trim();
      if (priceLabel.trim()) body.priceLabel = priceLabel.trim();
      const cap = parseInt(capacity, 10);
      if (!isNaN(cap) && cap > 0) body.capacity = cap;

      const res = await fetch(`/api/boats/${boat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "저장 실패");
      setEditing(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CardBase className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">선사 정보</p>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-sky-700"
          >
            수정
          </button>
        )}
      </div>

      {!editing ? (
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500">연락처</dt>
            <dd className="font-medium">{dash(boat.contact)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">예약 페이지</dt>
            <dd className="max-w-[55%] truncate font-medium">
              {boat.bookingUrl ? (
                <a
                  href={boat.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 underline"
                >
                  {boat.bookingUrl}
                </a>
              ) : (
                "미입력"
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">가격</dt>
            <dd className="font-medium">{dash(boat.priceLabel)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">정원</dt>
            <dd className="font-medium">{boat.capacity}명</dd>
          </div>
        </dl>
      ) : (
        <div className="mt-3 space-y-2">
          <input
            placeholder="연락처 (예: 010-1234-5678)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={inputCls}
          />
          <input
            placeholder="예약 페이지 URL"
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
            className={inputCls}
          />
          <input
            placeholder="가격 (예: 1인 12만원~)"
            value={priceLabel}
            onChange={(e) => setPriceLabel(e.target.value)}
            className={inputCls}
          />
          <input
            type="number"
            min={1}
            placeholder="정원 (명)"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className={inputCls}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => void save()}
              disabled={submitting}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-xl bg-sky-700 text-sm font-semibold text-white active:bg-sky-800 disabled:opacity-60"
            >
              {submitting ? "저장 중…" : "저장"}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setError(null); }}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-neutral-700 active:bg-neutral-50"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </CardBase>
  );
}
