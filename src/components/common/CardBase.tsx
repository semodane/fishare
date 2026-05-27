import type { ReactNode } from "react";

export function CardBase({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-black/10 bg-white shadow-sm",
        className ?? ""
      ].join(" ")}
    >
      {children}
    </div>
  );
}

