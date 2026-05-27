import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import { Providers } from "@/components/common/Providers";

export const metadata: Metadata = {
  title: "Fishare",
  description: "Fishare MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-neutral-50 text-neutral-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

