import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import type { UserRole } from "@/auth.d";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: "📊" },
  { href: "/admin/harbors", label: "항구 관리", icon: "⚓" },
  { href: "/admin/users", label: "회원 관리", icon: "👥" },
  { href: "/admin/reviews", label: "리뷰 관리", icon: "📝" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const role = ((session?.user as { role?: UserRole } | undefined)?.role ?? "USER") as UserRole;

  if (!session?.user || (role !== "OWNER" && role !== "ADMIN")) {
    redirect("/");
  }

  const nickname = (session.user as { nickname?: string }).nickname ?? session.user.name ?? "관리자";

  return (
    <div className="min-h-dvh bg-neutral-50">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-sm font-bold text-sky-700">
              Fishare Admin
            </Link>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${role === "OWNER" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>
              {role === "OWNER" ? "소유자" : "관리자"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-neutral-500 sm:inline">{nickname}</span>
            <Link href="/" className="text-xs font-medium text-sky-700 active:opacity-70">
              서비스로 이동 →
            </Link>
          </div>
        </div>

        {/* 모바일 탭 내비게이션 (sm 미만) */}
        <nav className="flex border-t border-black/[0.06] sm:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-neutral-600 active:bg-neutral-50"
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>

      <div className="mx-auto flex max-w-5xl gap-6 px-4 py-5 sm:py-6">
        {/* 사이드바 (sm 이상) */}
        <aside className="hidden w-44 shrink-0 sm:block">
          <nav className="sticky top-20 space-y-1 rounded-2xl border border-black/10 bg-white p-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* 본문 */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
