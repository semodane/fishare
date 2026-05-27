"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Harbor } from "@/types/harbor";
import type { Boat } from "@/types/boat";
import type { Place, PlaceCategory } from "@/types/place";
import { CardBase } from "@/components/common/CardBase";

const PLACE_CATEGORY_LABEL: Record<PlaceCategory, string> = {
  tackle_shop: "낚시용품점",
  early_restaurant: "새벽식당",
  fish_cleaning: "손질센터",
  cooking_restaurant: "즉석요리"
};

type SubTab = "boat" | "place";

// ── 선박 신규 등록 폼 ──────────────────────────────────────────
function FeatureToggle({
  label, value, onChange
}: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-neutral-700">{label}</span>
      <div className="flex gap-1">
        {([true, false] as const).map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={[
              "rounded-lg px-3 py-1 text-xs font-medium",
              value === v
                ? "bg-sky-700 text-white"
                : "border border-black/10 bg-white text-neutral-600 active:bg-neutral-50"
            ].join(" ")}
          >
            {v ? "있음" : "없음"}
          </button>
        ))}
      </div>
    </div>
  );
}

function NewBoatForm({
  harborId,
  departureHarborName,
  onCreated
}: {
  harborId: string;
  departureHarborName: string;
  onCreated: (boatId: string) => void;
}) {
  const [name, setName] = useState("");
  const [equipmentRental, setEquipmentRental] = useState<boolean | null>(null);
  const [lifeJacketProvided, setLifeJacketProvided] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!name.trim()) { setError("선박명을 입력해주세요."); return; }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/boats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          harborId, name, departureHarborName,
          features: { equipmentRental, lifeJacketProvided }
        })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "등록 실패");
      onCreated(json.data.item.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-sky-800">선박 신규 등록</p>
      <input
        placeholder="선박명 *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputCls}
      />
      <div className="rounded-xl border border-sky-100 bg-white p-3 space-y-2.5">
        <p className="text-xs font-semibold text-neutral-500">선박 정보 (선택)</p>
        <FeatureToggle label="장비 대여" value={equipmentRental} onChange={setEquipmentRental} />
        <FeatureToggle label="구명조끼 제공" value={lifeJacketProvided} onChange={setLifeJacketProvided} />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="button"
        onClick={() => void submit()}
        disabled={submitting}
        className={submitCls}
      >
        {submitting ? "등록 중…" : "등록 후 리뷰 작성하기"}
      </button>
    </div>
  );
}

// ── 편의시설 신규 등록 폼 ────────────────────────────────────────
function NewPlaceForm({
  harborId,
  onCreated
}: {
  harborId: string;
  onCreated: (placeId: string) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<PlaceCategory>("tackle_shop");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!name.trim()) { setError("시설명을 입력해주세요."); return; }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ harborId, name, category })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "등록 실패");
      onCreated(json.data.item.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-sky-800">편의시설 신규 등록</p>
      <input
        placeholder="시설명 *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputCls}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as PlaceCategory)}
        className={inputCls}
      >
        {(Object.entries(PLACE_CATEGORY_LABEL) as [PlaceCategory, string][]).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="button"
        onClick={() => void submit()}
        disabled={submitting}
        className={submitCls}
      >
        {submitting ? "등록 중…" : "등록 후 리뷰 작성하기"}
      </button>
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-400";
const submitCls =
  "inline-flex h-10 w-full items-center justify-center rounded-xl bg-sky-700 text-sm font-semibold text-white active:bg-sky-800 disabled:opacity-60";

// ── 메인 셀렉터 ──────────────────────────────────────────────────
export function ReviewTargetSelector({
  harbors,
  boats,
  places
}: {
  harbors: Harbor[];
  boats: Boat[];
  places: Place[];
}) {
  const router = useRouter();
  const [selectedHarborId, setSelectedHarborId] = useState<string | null>(null);
  const [tab, setTab] = useState<SubTab>("boat");
  const [showNewForm, setShowNewForm] = useState(false);

  const selectedHarbor = harbors.find((h) => h.id === selectedHarborId);
  const filteredBoats = boats.filter((b) => b.harborId === selectedHarborId);
  const filteredPlaces = places.filter((p) => p.harborId === selectedHarborId);

  function goReview(targetType: "boat" | "place", targetId: string) {
    router.push(
      `/reviews/write?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}`
    );
  }

  function handleTabChange(t: SubTab) {
    setTab(t);
    setShowNewForm(false);
  }

  // 1단계: 항구 선택
  if (!selectedHarborId) {
    return (
      <div className="space-y-4">
        <CardBase className="p-4">
          <p className="text-sm font-semibold">어느 항구를 방문하셨나요?</p>
          <p className="mt-1 text-xs text-neutral-500">
            항구를 선택하면 해당 항구의 선박·편의시설 목록이 나옵니다.
          </p>
        </CardBase>
        <div className="space-y-2">
          {harbors.length === 0 ? (
            <Empty label="등록된 항구가 없어요." />
          ) : (
            harbors.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => { setSelectedHarborId(h.id); setTab("boat"); setShowNewForm(false); }}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-left shadow-sm active:bg-neutral-50"
              >
                <div className="text-sm font-semibold">{h.name}</div>
                <div className="mt-0.5 text-xs text-neutral-500">
                  {h.region} · {h.areaLabel}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  // 2단계: 선박 / 편의시설 선택 (+ 신규 등록)
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setSelectedHarborId(null)}
        className="flex items-center gap-1 text-xs font-medium text-sky-700"
      >
        <span>←</span>
        <span>항구 다시 선택</span>
      </button>

      <CardBase className="p-4">
        <p className="text-sm font-semibold">{selectedHarbor?.name}</p>
        <p className="mt-1 text-xs text-neutral-500">
          기존 선박·편의시설을 선택하거나, 없으면 신규 등록 후 리뷰를 작성하세요.
        </p>
      </CardBase>

      {/* 탭 */}
      <div className="flex gap-1 rounded-2xl border border-black/10 bg-white p-1 shadow-sm">
        {(["boat", "place"] as SubTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabChange(t)}
            className={[
              "flex-1 rounded-xl py-2 text-sm font-semibold transition-colors",
              tab === t ? "bg-sky-700 text-white" : "text-neutral-500 hover:bg-neutral-50"
            ].join(" ")}
          >
            {t === "boat" ? "선박" : "편의시설"}
          </button>
        ))}
      </div>

      {/* 기존 목록 */}
      <div className="space-y-2">
        {tab === "boat" && (
          <>
            {filteredBoats.length === 0 ? (
              <Empty label="등록된 선박이 없어요." />
            ) : (
              filteredBoats.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => goReview("boat", b.id)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-left shadow-sm active:bg-neutral-50"
                >
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="mt-0.5 flex flex-wrap gap-x-1.5 text-xs text-neutral-500">
                    {b.operatorName && b.operatorName !== "-" && <span>{b.operatorName}</span>}
                    {b.priceLabel && b.priceLabel !== "-" && <span>{b.priceLabel}</span>}
                    {b.capacity > 1 && <span>정원 {b.capacity}명</span>}
                  </div>
                </button>
              ))
            )}

            {/* 신규 등록 토글 */}
            {!showNewForm && (
              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                className="w-full rounded-2xl border border-dashed border-sky-400 bg-white px-4 py-3 text-center text-sm font-medium text-sky-700 active:bg-sky-50"
              >
                + 목록에 없는 선박 등록하기
              </button>
            )}
            {showNewForm && (
              <NewBoatForm
                harborId={selectedHarborId}
                departureHarborName={selectedHarbor?.name ?? ""}
                onCreated={(id) => goReview("boat", id)}
              />
            )}
          </>
        )}

        {tab === "place" && (
          <>
            {filteredPlaces.length === 0 ? (
              <Empty label="등록된 편의시설이 없어요." />
            ) : (
              filteredPlaces.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goReview("place", p.id)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-left shadow-sm active:bg-neutral-50"
                >
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-0.5 text-xs text-neutral-500">
                    {PLACE_CATEGORY_LABEL[p.category]}
                  </div>
                </button>
              ))
            )}

            {!showNewForm && (
              <button
                type="button"
                onClick={() => setShowNewForm(true)}
                className="w-full rounded-2xl border border-dashed border-sky-400 bg-white px-4 py-3 text-center text-sm font-medium text-sky-700 active:bg-sky-50"
              >
                + 목록에 없는 편의시설 등록하기
              </button>
            )}
            {showNewForm && (
              <NewPlaceForm
                harborId={selectedHarborId}
                onCreated={(id) => goReview("place", id)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 text-center text-sm text-neutral-500">
      {label}
    </div>
  );
}
