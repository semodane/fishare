"use client";

import { getProviders, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { MobilePageLayout } from "@/components/common/MobilePageLayout";
import { CardBase } from "@/components/common/CardBase";
import { SectionHeader } from "@/components/common/SectionHeader";

function ProviderButton({
  label,
  onClick,
  disabled,
  hint
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={[
          "inline-flex h-11 w-full items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-neutral-900",
          "active:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
          "disabled:cursor-not-allowed disabled:opacity-60"
        ].join(" ")}
      >
        {label}로 계속하기
      </button>
      {hint ? <p className="text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

function LoginContent() {
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/";
  const [providerKeys, setProviderKeys] = useState<Set<string> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const providers = await getProviders();
        if (cancelled) return;
        setProviderKeys(new Set(Object.keys(providers ?? {})));
      } catch {
        if (cancelled) return;
        setProviderKeys(new Set());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const googleReady = providerKeys?.has("google") ?? false;
  const kakaoReady = providerKeys?.has("kakao") ?? false;

  return (
    <div className="space-y-2">
      <ProviderButton
        label="구글"
        onClick={() => void signIn("google", { callbackUrl })}
        disabled={providerKeys === null ? true : !googleReady}
        hint={
          providerKeys === null
            ? "로그인 제공자를 확인 중…"
            : !googleReady
              ? "서버 환경 변수 설정 후 활성화됩니다."
              : undefined
        }
      />
      <ProviderButton
        label="카카오"
        onClick={() => void signIn("kakao", { callbackUrl })}
        disabled={providerKeys === null ? true : !kakaoReady}
        hint={
          providerKeys === null
            ? "로그인 제공자를 확인 중…"
            : !kakaoReady
              ? "서버 환경 변수 설정 후 활성화됩니다."
              : undefined
        }
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <MobilePageLayout headerVariant="back-title" title="로그인" backHref="/">
      <div className="space-y-4">
        <CardBase className="p-4">
          <SectionHeader
            title="Fishare 로그인"
            subtitle="저장/리뷰 작성 등 보호 기능을 사용하려면 로그인하세요."
          />
        </CardBase>
        <Suspense fallback={<div className="space-y-2 opacity-60"><div className="h-11 rounded-xl bg-neutral-100" /><div className="h-11 rounded-xl bg-neutral-100" /></div>}>
          <LoginContent />
        </Suspense>
      </div>
    </MobilePageLayout>
  );
}

