"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  initialNickname?: string;
  initialImage?: string;
};

// 이미지를 최대 300×300으로 리사이즈 후 base64 반환
function resizeToBase64(file: File, maxPx = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("이미지 로드 실패")); };
    img.src = url;
  });
}

function Avatar({ src, nickname, size = 56 }: { src?: string; nickname?: string; size?: number }) {
  const initial = (nickname ?? "?")[0].toUpperCase();
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="프로필" width={size} height={size}
        className="rounded-full object-cover ring-2 ring-sky-100"
        style={{ width: size, height: size }} />
    );
  }
  return (
    <div style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="flex items-center justify-center rounded-full bg-sky-100 font-bold text-sky-600">
      {initial}
    </div>
  );
}

type NicknameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export function ProfileEditor({ initialNickname, initialImage }: Props) {
  const { update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(initialNickname ?? "");
  const [previewImage, setPreviewImage] = useState<string | undefined>(initialImage);
  const [imageBase64, setImageBase64] = useState<string | null | undefined>(undefined);
  // undefined = 변경 없음, null = 제거, string = 새 이미지
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 저장 후 router.refresh()로 prop이 바뀌면 preview 동기화
  useEffect(() => {
    if (!editing) {
      setPreviewImage(initialImage);
      setImageBase64(undefined);
    }
  }, [initialImage, editing]);

  const [nickStatus, setNickStatus] = useState<NicknameStatus>("idle");
  const [nickTimer, setNickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // 닉네임 입력 시 디바운스 유니크 체크
  const handleNicknameChange = useCallback((val: string) => {
    setNickname(val);
    setNickStatus("idle");
    if (nickTimer) clearTimeout(nickTimer);
    const trimmed = val.trim();
    if (trimmed === initialNickname) { setNickStatus("idle"); return; }
    if (trimmed.length < 2) { if (trimmed.length > 0) setNickStatus("invalid"); return; }
    if (trimmed.length > 20) { setNickStatus("invalid"); return; }
    setNickStatus("checking");
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/user/profile?checkNickname=${encodeURIComponent(trimmed)}`);
        const json = await res.json() as { ok: boolean; data?: { available: boolean; reason?: string } };
        if (json.ok) setNickStatus(json.data?.available ? "available" : "taken");
      } catch { setNickStatus("idle"); }
    }, 600);
    setNickTimer(t);
  }, [initialNickname, nickTimer]);

  // 갤러리에서 이미지 선택
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await resizeToBase64(file);
      setPreviewImage(b64);
      setImageBase64(b64);
    } catch {
      setError("이미지를 불러오지 못했습니다");
    }
    e.target.value = "";
  }

  function removeImage() {
    setPreviewImage(undefined);
    setImageBase64(null);
  }

  async function save() {
    const trimmedNick = nickname.trim();
    if (!trimmedNick) { setError("닉네임을 입력해주세요"); return; }
    if (trimmedNick.length < 2 || trimmedNick.length > 20) { setError("닉네임은 2~20자여야 합니다"); return; }
    if (nickStatus === "taken") { setError("이미 사용 중인 닉네임입니다"); return; }
    if (nickStatus === "checking") { setError("닉네임 확인 중입니다. 잠시 후 다시 시도해주세요"); return; }

    setSaving(true);
    setError(null);

    const body: Record<string, unknown> = { nickname: trimmedNick };
    if (imageBase64 !== undefined) body.image = imageBase64; // null이면 제거

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json() as { ok: boolean; error?: { message: string } };
      if (!json.ok) { setError(json.error?.message ?? "저장에 실패했습니다"); return; }
      await update({ nickname: trimmedNick });
      router.refresh();
      setEditing(false);
      setImageBase64(undefined);
      setNickStatus("idle");
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setNickname(initialNickname ?? "");
    setPreviewImage(initialImage);
    setImageBase64(undefined);
    setError(null);
    setNickStatus("idle");
    setEditing(false);
  }

  const nickHint =
    nickStatus === "checking" ? { text: "확인 중…", color: "text-neutral-400" } :
    nickStatus === "available" ? { text: "사용 가능한 닉네임이에요", color: "text-green-600" } :
    nickStatus === "taken" ? { text: "이미 사용 중인 닉네임이에요", color: "text-red-500" } :
    nickStatus === "invalid" ? { text: "닉네임은 2~20자여야 합니다", color: "text-red-500" } :
    null;

  /* ── 보기 모드 ── */
  if (!editing) {
    return (
      <div className="flex items-center gap-4">
        <Avatar src={initialImage} nickname={initialNickname} size={56} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-neutral-500">닉네임</p>
          <p className="mt-0.5 truncate text-base font-semibold text-neutral-900">
            {initialNickname ?? <span className="text-neutral-400">미설정</span>}
          </p>
        </div>
        <button type="button" onClick={() => setEditing(true)}
          className="shrink-0 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 active:bg-neutral-50">
          수정
        </button>
      </div>
    );
  }

  /* ── 편집 모드 ── */
  return (
    <div className="space-y-4">
      {/* 아바타 + 사진 변경 */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <Avatar src={previewImage} nickname={nickname || initialNickname} size={80} />
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-sky-600 shadow active:bg-sky-700"
            aria-label="사진 변경">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
        </div>
        {previewImage && (
          <button type="button" onClick={removeImage}
            className="text-xs text-red-500 active:text-red-600">
            사진 제거
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => void handleFileChange(e)} />
      </div>

      {/* 닉네임 */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-neutral-500">닉네임 *</label>
        <input type="text" value={nickname}
          onChange={(e) => handleNicknameChange(e.target.value)}
          maxLength={20} placeholder="2~20자"
          className={[
            "h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none transition",
            nickStatus === "available" ? "border-green-400 focus:ring-2 focus:ring-green-200" :
            nickStatus === "taken" || nickStatus === "invalid" ? "border-red-400 focus:ring-2 focus:ring-red-200" :
            "border-black/15 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          ].join(" ")}
          autoFocus
        />
        {nickHint && (
          <p className={`text-xs ${nickHint.color}`}>{nickHint.text}</p>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button type="button" onClick={() => void save()} disabled={saving || nickStatus === "taken" || nickStatus === "checking"}
          className="h-10 flex-1 rounded-xl bg-sky-600 text-sm font-semibold text-white active:bg-sky-700 disabled:opacity-50">
          {saving ? "저장 중…" : "저장"}
        </button>
        <button type="button" onClick={cancel}
          className="h-10 rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-neutral-600 active:bg-neutral-50">
          취소
        </button>
      </div>
    </div>
  );
}
