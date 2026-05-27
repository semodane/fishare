"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KHOA_STATIONS } from "@/lib/khoa";

const AREA_LABELS = ["서해", "남해", "동해", "제주", "수도권", "기타"];

type HarborFormData = {
  name: string;
  region: string;
  areaLabel: string;
  description: string;
  address: string;
  tags: string;
  mainSpecies: string;
  obsCode: string;
};

type Harbor = {
  id: string;
  name: string;
  region: string;
  areaLabel: string;
  description: string;
  address: string;
  tags: string[];
  mainSpecies: unknown;
  obsCode?: string | null;
};

const EMPTY: HarborFormData = {
  name: "", region: "", areaLabel: "서해",
  description: "", address: "", tags: "", mainSpecies: "", obsCode: ""
};

function toFormData(h: Harbor): HarborFormData {
  return {
    name: h.name,
    region: h.region,
    areaLabel: h.areaLabel,
    description: h.description,
    address: h.address,
    tags: h.tags.join(", "),
    mainSpecies: Array.isArray(h.mainSpecies) ? (h.mainSpecies as string[]).join(", ") : "",
    obsCode: h.obsCode ?? ""
  };
}

function InputField({ label, name, value, onChange, required, placeholder, multiline }: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; required?: boolean;
  placeholder?: string; multiline?: boolean;
}) {
  const base = "w-full rounded-xl border border-black/15 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-sky-400 focus:bg-white transition";
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-neutral-600">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={base + " resize-none"}
          name={name}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
          name={name}
        />
      )}
    </div>
  );
}

export function HarborAddButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white active:bg-sky-800"
      >
        + 항구 추가
      </button>
      {open && <HarborModal onClose={() => setOpen(false)} />}
    </>
  );
}

export function HarborEditButton({ harbor }: { harbor: Harbor }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-neutral-600 active:bg-neutral-100"
      >
        수정
      </button>
      {open && <HarborModal harbor={harbor} onClose={() => setOpen(false)} />}
    </>
  );
}

export function HarborDeleteButton({ harborId }: { harborId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("이 항구를 비활성화 하시겠습니까?\n(소속 선박/편의시설 데이터는 유지됩니다)")) return;
    setLoading(true);
    await fetch(`/api/admin/harbors/${harborId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 active:bg-red-50 disabled:opacity-50"
    >
      {loading ? "처리중…" : "비활성화"}
    </button>
  );
}

function HarborModal({ harbor, onClose }: { harbor?: Harbor; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<HarborFormData>(harbor ? toFormData(harbor) : EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof HarborFormData) {
    return (v: string) => setForm((f) => ({ ...f, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const mainSpecies = form.mainSpecies.split(",").map((s) => s.trim()).filter(Boolean);

    const url = harbor ? `/api/admin/harbors/${harbor.id}` : "/api/admin/harbors";
    const method = harbor ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, region: form.region, areaLabel: form.areaLabel,
        description: form.description, address: form.address,
        tags, mainSpecies: mainSpecies.length ? mainSpecies : undefined,
        obsCode: form.obsCode || null
      })
    });

    const json = await res.json() as { ok: boolean; error?: { message: string } };
    if (!json.ok) {
      setError(json.error?.message ?? "오류가 발생했습니다");
      setLoading(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">
            {harbor ? "항구 수정" : "새 항구 추가"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 active:text-neutral-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <InputField label="항구명" name="name" value={form.name} onChange={set("name")} required placeholder="예: 군산항" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="지역" name="region" value={form.region} onChange={set("region")} required placeholder="예: 전북" />
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-neutral-600">
                해역<span className="ml-0.5 text-red-500">*</span>
              </label>
              <select
                value={form.areaLabel}
                onChange={(e) => set("areaLabel")(e.target.value)}
                className="w-full rounded-xl border border-black/15 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-sky-400 focus:bg-white"
              >
                {AREA_LABELS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <InputField label="주소" name="address" value={form.address} onChange={set("address")} required placeholder="예: 전북특별자치도 군산시" />
          <InputField label="소개" name="description" value={form.description} onChange={set("description")} required placeholder="항구 특징을 간략히 설명해주세요" multiline />
          <InputField label="태그 (쉼표로 구분)" name="tags" value={form.tags} onChange={set("tags")} placeholder="예: 서해, 출조, 초보추천" />
          <InputField label="주요 어종 (쉼표로 구분)" name="mainSpecies" value={form.mainSpecies} onChange={set("mainSpecies")} placeholder="예: 광어, 우럭, 삼치" />

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-600">
              물때 관측소 <span className="font-normal text-neutral-400">(선택 — 설정 시 실시간 물때 표시)</span>
            </label>
            <select
              value={form.obsCode}
              onChange={(e) => set("obsCode")(e.target.value)}
              className="w-full rounded-xl border border-black/15 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-sky-400 focus:bg-white"
            >
              <option value="">— 미설정 —</option>
              {["서해", "남해", "동해", "제주", "수도권"].map((area) => (
                <optgroup key={area} label={area}>
                  {KHOA_STATIONS.filter((s) => s.area === area).map((s) => (
                    <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm font-medium text-neutral-600 active:bg-neutral-50">
              취소
            </button>
            <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-sky-700 py-2.5 text-sm font-semibold text-white active:bg-sky-800 disabled:opacity-50">
              {loading ? "저장중…" : harbor ? "수정 완료" : "추가하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
