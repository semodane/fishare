import type { ReactNode } from "react";
import type { BottomTabKey } from "./navigation";
import { MobilePageLayout } from "./MobilePageLayout";

export function AppShell({
  title,
  activeTab,
  children
}: {
  title: string;
  activeTab?: BottomTabKey;
  children: ReactNode;
}) {
  const headerVariant = activeTab ? "logo-search" : "back-title";
  return (
    <MobilePageLayout
      headerVariant={headerVariant}
      title={title}
      activeTab={activeTab}
    >
      {children}
    </MobilePageLayout>
  );
}

