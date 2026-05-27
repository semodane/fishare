export function LoadingSkeleton({
  rows = 3
}: {
  rows?: number;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
        >
          <div className="h-4 w-1/3 rounded bg-neutral-200" />
          <div className="mt-2 h-3 w-2/3 rounded bg-neutral-100" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-neutral-100" />
            <div className="h-6 w-20 rounded-full bg-neutral-100" />
            <div className="h-6 w-14 rounded-full bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

