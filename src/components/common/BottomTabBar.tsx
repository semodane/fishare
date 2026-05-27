import Link from "next/link";
import type { BottomTabKey } from "./navigation";

type TabIcon = (props: { active: boolean }) => React.ReactElement;

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#0369a1" : "#737373"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function AnchorIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#0369a1" : "#737373"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="21" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
  );
}

function EditIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#0369a1" : "#737373"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#0369a1" : "#737373"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function PersonIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#0369a1" : "#737373"} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

type TabDef = {
  key: BottomTabKey;
  label: string;
  href: string;
  Icon: TabIcon;
};

const ITEMS: TabDef[] = [
  { key: "home", label: "홈", href: "/", Icon: HomeIcon },
  { key: "harbors", label: "항구찾기", href: "/harbors", Icon: AnchorIcon },
  { key: "review_write", label: "리뷰쓰기", href: "/reviews/write", Icon: EditIcon },
  { key: "my_reviews", label: "나의리뷰", href: "/my/reviews", Icon: ListIcon },
  { key: "my", label: "마이", href: "/my", Icon: PersonIcon }
];

export function BottomTabBar({
  activeKey
}: {
  activeKey?: BottomTabKey;
}) {
  return (
    <nav
      aria-label="하단 탭"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70"
    >
      <div className="mx-auto flex h-[60px] max-w-[390px] items-stretch px-1 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              ].join(" ")}
            >
              <item.Icon active={isActive} />
              <span
                className={[
                  "text-[10px] font-medium leading-none",
                  isActive ? "text-sky-700" : "text-neutral-500"
                ].join(" ")}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
