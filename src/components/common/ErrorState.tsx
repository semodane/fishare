import type { ReactNode } from "react";

export function ErrorState({
  title = "문제가 발생했어요",
  description,
  action
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
      <div className="text-sm font-semibold text-red-800">{title}</div>
      {description ? (
        <p className="mt-1 text-sm text-red-700">{description}</p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

