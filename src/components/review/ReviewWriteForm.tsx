"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  BoatDetailScores,
  CreateReviewInput,
  HarborDetailScores,
  PlaceDetailScores,
  ReviewTargetType,
  ReviewTagKey,
  Score5
} from "@/types/review";
import { CardBase } from "@/components/common/CardBase";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeader } from "@/components/common/SectionHeader";
import { RatingInput } from "./RatingInput";
import { tagsForTarget } from "./reviewTags";

type TargetInfo = {
  targetType: ReviewTargetType;
  targetId: string;
  title: string;
  subtitle: string;
  backHref: string;
};

type BoatFeatures = {
  equipmentRental?: boolean | null;
  lifeJacketProvided?: boolean | null;
};

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
              "rounded-lg px-3 py-1.5 text-xs font-medium",
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

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function ReviewWriteForm({
  target,
  initialBoatFeatures
}: {
  target: TargetInfo | null;
  initialBoatFeatures?: BoatFeatures | null;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl");

  const [rating, setRating] = useState<Score5>(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visitedAt, setVisitedAt] = useState(todayYYYYMMDD());
  const [wouldRevisit, setWouldRevisit] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<ReviewTagKey[]>([]);
  const [boatTagInput, setBoatTagInput] = useState(""); // 선박 태그 입력창
  const [boatTags, setBoatTags] = useState<string[]>([]); // 추가된 태그 목록
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [boatFeatures, setBoatFeatures] = useState<BoatFeatures>({
    equipmentRental: initialBoatFeatures?.equipmentRental ?? null,
    lifeJacketProvided: initialBoatFeatures?.lifeJacketProvided ?? null
  });

  const [harborScores, setHarborScores] = useState<HarborDetailScores>({
    accessibility: 4,
    convenience: 4,
    overall: 4
  });
  const [boatScores, setBoatScores] = useState<BoatDetailScores>({
    captainKindness: 4,
    cleanliness: 4,
    restroomCleanliness: 4,
    beginnerFriendly: 4,
    guidanceSatisfaction: 4
  });
  const [placeScores, setPlaceScores] = useState<PlaceDetailScores>({
    kindness: 4,
    priceSatisfaction: 4,
    quality: 4,
    convenience: 4
  });

  const tagOptions = useMemo(() => {
    if (!target) return [];
    return tagsForTarget(target.targetType);
  }, [target]);

  if (!target) {
    return (
      <EmptyState
        title="리뷰 대상을 찾을 수 없어요"
        description='예: `/reviews/write?targetType=harbor&targetId=h_gunsan`'
      />
    );
  }

  const detailScores = (() => {
    if (target.targetType === "harbor") return harborScores;
    if (target.targetType === "boat") return boatScores;
    return placeScores;
  })();

  function validate(): string | null {
    if (target?.targetType !== "boat" && selectedTags.length === 0) return "태그를 최소 1개 선택해주세요.";
    if (title.trim().length < 2) return "한줄평을 2자 이상 입력해주세요.";
    if (content.trim().length < 10) return "상세 코멘트를 10자 이상 입력해주세요.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(visitedAt)) return "방문일 형식이 올바르지 않아요.";
    return null;
  }

  async function submit() {
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    if (submitting) return;
    if (!target) return;
    setSubmitting(true);
    try {
      const tags =
        target.targetType === "boat"
          ? boatTags
          : selectedTags;

      const payload: CreateReviewInput = {
        targetType: target.targetType,
        targetId: target.targetId,
        rating,
        tags,
        detailScores,
        title: title.trim(),
        content: content.trim(),
        wouldRevisit,
        visitedAt
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(json?.error ?? "리뷰 등록에 실패했어요.");
      }

      // 선박 리뷰 작성 시 features 업데이트
      if (target.targetType === "boat") {
        await fetch(`/api/boats/${target.targetId}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ features: boatFeatures })
        }).catch(() => null);
      }

      router.push(callbackUrl ?? target.backHref);
    } catch (e) {
      setError(e instanceof Error ? e.message : "리뷰 등록에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <CardBase className="p-4">
        <SectionHeader title="대상 정보" subtitle="리뷰를 남길 대상을 확인하세요" />
        <div className="mt-3 rounded-xl bg-neutral-50 p-3">
          <div className="text-xs font-medium text-neutral-600">
            {target.targetType.toUpperCase()}
          </div>
          <div className="mt-1 text-sm font-semibold">{target.title}</div>
          <div className="mt-0.5 text-xs text-neutral-600">{target.subtitle}</div>
        </div>
      </CardBase>

      <CardBase className="p-4">
        <RatingInput label="전체 평점" value={rating} onChange={setRating} />
      </CardBase>

      <CardBase className="p-4">
        {target.targetType === "boat" ? (
          <>
            <SectionHeader title="태그" subtitle="이번 출조의 포인트를 태그로 남겨주세요" />
            <div className="mt-3 space-y-2">
              {/* 추가된 태그 타일 */}
              {boatTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {boatTags.map((tag, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => setBoatTags((prev) => prev.filter((_, idx) => idx !== i))}
                        className="ml-0.5 text-sky-400 hover:text-sky-700 leading-none"
                        aria-label="태그 삭제"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {/* 입력창 + 추가 버튼 */}
              <div className="flex gap-2">
                <input
                  value={boatTagInput}
                  onChange={(e) => setBoatTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const tag = boatTagInput.trim().replace(/^#+/, "");
                      if (tag && !boatTags.includes(tag)) setBoatTags((prev) => [...prev, tag]);
                      setBoatTagInput("");
                    }
                  }}
                  placeholder="예: 친절한 선장"
                  className="h-10 flex-1 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    const tag = boatTagInput.trim().replace(/^#+/, "");
                    if (tag && !boatTags.includes(tag)) setBoatTags((prev) => [...prev, tag]);
                    setBoatTagInput("");
                  }}
                  className="h-10 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white active:bg-sky-800 disabled:opacity-50"
                  disabled={!boatTagInput.trim()}
                >
                  추가
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <SectionHeader title="태그 선택" subtitle="후기의 포인트를 골라주세요" />
            <div className="mt-3 flex flex-wrap gap-2">
              {tagOptions.map((t) => {
                const active = selectedTags.includes(t.key);
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        active ? prev.filter((k) => k !== t.key) : [...prev, t.key]
                      )
                    }
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-medium",
                      active
                        ? "bg-sky-700 text-white"
                        : "border border-black/10 bg-white text-neutral-700 active:bg-neutral-50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {t.label}
                  </button>
                );
              })}
              {tagOptions.length === 0 && (
                <span className="text-xs text-neutral-500">선택 가능한 태그가 없어요.</span>
              )}
            </div>
          </>
        )}
      </CardBase>

      <CardBase className="p-4">
        <SectionHeader title="세부 점수" subtitle="타입에 따라 항목이 달라요" />
        <div className="mt-3 space-y-4">
          {target.targetType === "harbor" ? (
            <>
              <RatingInput
                label="접근성"
                value={harborScores.accessibility}
                onChange={(v) => setHarborScores((s) => ({ ...s, accessibility: v }))}
              />
              <RatingInput
                label="편의성"
                value={harborScores.convenience}
                onChange={(v) => setHarborScores((s) => ({ ...s, convenience: v }))}
              />
              <RatingInput
                label="전반 만족"
                value={harborScores.overall}
                onChange={(v) => setHarborScores((s) => ({ ...s, overall: v }))}
              />
            </>
          ) : target.targetType === "boat" ? (
            <>
              <RatingInput
                label="선장 친절"
                value={boatScores.captainKindness}
                onChange={(v) =>
                  setBoatScores((s) => ({ ...s, captainKindness: v }))
                }
              />
              <RatingInput
                label="청결"
                value={boatScores.cleanliness}
                onChange={(v) => setBoatScores((s) => ({ ...s, cleanliness: v }))}
              />
              <RatingInput
                label="화장실"
                value={boatScores.restroomCleanliness}
                onChange={(v) => setBoatScores((s) => ({ ...s, restroomCleanliness: v }))}
              />
              <RatingInput
                label="초보 추천"
                value={boatScores.beginnerFriendly}
                onChange={(v) =>
                  setBoatScores((s) => ({ ...s, beginnerFriendly: v }))
                }
              />
              <RatingInput
                label="안내 만족"
                value={boatScores.guidanceSatisfaction}
                onChange={(v) =>
                  setBoatScores((s) => ({ ...s, guidanceSatisfaction: v }))
                }
              />
            </>
          ) : (
            <>
              <RatingInput
                label="친절"
                value={placeScores.kindness}
                onChange={(v) => setPlaceScores((s) => ({ ...s, kindness: v }))}
              />
              <RatingInput
                label="가격 만족"
                value={placeScores.priceSatisfaction}
                onChange={(v) =>
                  setPlaceScores((s) => ({ ...s, priceSatisfaction: v }))
                }
              />
              <RatingInput
                label="품질"
                value={placeScores.quality}
                onChange={(v) => setPlaceScores((s) => ({ ...s, quality: v }))}
              />
              <RatingInput
                label="편의성"
                value={placeScores.convenience}
                onChange={(v) =>
                  setPlaceScores((s) => ({ ...s, convenience: v }))
                }
              />
            </>
          )}
        </div>
      </CardBase>

      {target.targetType === "boat" && (
        <CardBase className="p-4">
          <SectionHeader title="선박 정보" subtitle="다른 분들을 위해 확인해주세요" />
          <div className="mt-3 space-y-3">
            <FeatureToggle
              label="장비 대여"
              value={boatFeatures.equipmentRental ?? null}
              onChange={(v) => setBoatFeatures((f) => ({ ...f, equipmentRental: v }))}
            />
            <FeatureToggle
              label="구명조끼 제공"
              value={boatFeatures.lifeJacketProvided ?? null}
              onChange={(v) => setBoatFeatures((f) => ({ ...f, lifeJacketProvided: v }))}
            />
          </div>
        </CardBase>
      )}

      <CardBase className="p-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">한줄평</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 초보도 편하게 다녀왔어요"
            className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          />
        </label>
      </CardBase>

      <CardBase className="p-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">상세 코멘트</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="좋았던 점/아쉬웠던 점/팁을 적어주세요 (사진 업로드는 다음 단계)"
            className="min-h-28 w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          />
        </label>
      </CardBase>

      <CardBase className="p-4">
        <SectionHeader title="재이용 의사" subtitle="다시 방문/이용하고 싶나요?" />
        <div className="mt-3 flex gap-2">
          {[
            { v: true, label: "네" },
            { v: false, label: "아니요" }
          ].map((o) => {
            const active = o.v === wouldRevisit;
            return (
              <button
                key={String(o.v)}
                type="button"
                onClick={() => setWouldRevisit(o.v)}
                className={[
                  "flex-1 rounded-xl px-3 py-3 text-sm font-semibold",
                  active
                    ? "bg-sky-700 text-white"
                    : "border border-black/10 bg-white text-neutral-800 active:bg-neutral-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                ].join(" ")}
                aria-pressed={active}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </CardBase>

      <CardBase className="p-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">방문일</span>
          <input
            type="date"
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
            className="h-10 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          />
        </label>
      </CardBase>

      <button
        type="button"
        onClick={() => void submit()}
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-sky-700 text-sm font-semibold text-white active:bg-sky-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        {submitting ? "등록 중…" : "리뷰 등록"}
      </button>
    </div>
  );
}
