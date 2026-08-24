import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { AppToaster } from "@/components/ui/AppToaster";
import type { Metadata } from "next";
import "./globals.css";

const font = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "My Projects Hub",
    template: "%s | My Projects Hub",
  },
  description: "مكتبة استراتيجية لإدارة المشاريع والأفكار التجارية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={font.className}>
        <AppToaster />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
