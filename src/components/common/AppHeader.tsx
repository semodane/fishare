import Link from "next/link";
import type { ReactNode } from "react";

export type AppHeaderVariant = "logo-search" | "back-title";

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export function AppHeader(props: {
  variant: AppHeaderVariant;
  title?: string;
  backHref?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-12 max-w-[390px] items-center justify-between gap-2 px-4">
        {props.variant === "back-title" ? (
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href={props.backHref ?? "/"}
              aria-label="뒤로가기"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-neutral-900 active:bg-neutral-50"
            >
              <BackIcon />
            </Link>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {props.title ?? ""}
              </div>
            </div>
          </div>
        ) : (
          <Link href="/" className="truncate text-sm font-semibold">
            Fishare
          </Link>
        )}

        <div className="flex shrink-0 items-center gap-2">{props.right}</div>
      </div>
    </header>
  );
}

