"use client";

import { useEffect, useState } from "react";

type TidePrediction = {
  time: string;
  type: "high" | "low";
  heightCm: number;
  label: string;
};

type TideData = {
  stationName: string;
  date: string;
  tides: TidePrediction[];
  summary: string;
};

export function TideSection({ harborId }: { harborId: string }) {
  const [tide, setTide] = useState<TideData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tides/${harborId}`)
      .then((r) => r.json())
      .then((json: { ok: boolean; data: TideData | null }) => {
        if (json.ok && json.data) setTide(json.data);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [harborId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-base">🌊</span>
          <span className="text-sm font-semibold text-neutral-800">오늘의 물때</span>
        </div>
        <div className="h-12 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (!tide) return null;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🌊</span>
          <span className="text-sm font-semibold text-neutral-800">오늘의 물때</span>
        </div>
        <span className="text-[11px] text-neutral-400">
          {tide.date} · {tide.stationName}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {tide.tides.map((t, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
              t.type === "high" ? "bg-sky-50" : "bg-amber-50"
            }`}
          >
            <div>
              <p className={`text-[11px] font-medium ${t.type === "high" ? "text-sky-600" : "text-amber-600"}`}>
                {t.label}
              </p>
              <p className="text-sm font-bold text-neutral-800">{t.time}</p>
            </div>
            <p className={`text-sm font-semibold ${t.type === "high" ? "text-sky-700" : "text-amber-700"}`}>
              {t.heightCm}cm
            </p>
          </div>
        ))}
      </div>

      <p className="mt-2 text-xs text-neutral-400">
        출처: 국립해양조사원 · 예보지점 기준
      </p>
    </div>
  );
}
