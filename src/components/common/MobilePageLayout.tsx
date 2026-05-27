import type { ReactNode } from "react";
import type { BottomTabKey } from "./navigation";
import type { AppHeaderVariant } from "./AppHeader";
import { AppHeader } from "./AppHeader";
import { BottomTabBar } from "./BottomTabBar";
import { HeaderAuthButton } from "./HeaderAuthButton";

export function MobilePageLayout({
  headerVariant = "logo-search",
  title,
  backHref,
  right,
  activeTab,
  children
}: {
  headerVariant?: AppHeaderVariant;
  title?: string;
  backHref?: string;
  right?: ReactNode;
  activeTab?: BottomTabKey;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <AppHeader
        variant={headerVariant}
        title={title}
        backHref={backHref}
        right={right ?? <HeaderAuthButton />}
      />
      <main className="mx-auto max-w-[390px] px-4 pb-20 pt-4">{children}</main>
      <BottomTabBar activeKey={activeTab} />
    </div>
  );
}

