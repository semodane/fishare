"use client";

import type { Score5 } from "@/types/review";

export function RatingInput({
  value,
  onChange,
  label
}: {
  value: Score5;
  onChange: (next: Score5) => void;
  label: string;
}) {
  const options: Score5[] = [1, 2, 3, 4, 5];
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">{label}</div>
      <div className="flex gap-2">
        {options.map((v) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold",
                active
                  ? "bg-sky-700 text-white"
                  : "border border-black/10 bg-white text-neutral-800 active:bg-neutral-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              ].join(" ")}
              aria-pressed={active}
              aria-label={`${label} ${v}점`}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}

