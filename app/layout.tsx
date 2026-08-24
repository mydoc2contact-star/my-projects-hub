import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { AppToaster } from "@/components/ui/AppToaster";
import { APP_NAME, APP_TAGLINE, APP_URL } from "@/lib/constants";
import type { Metadata } from "next";
import "./globals.css";

const font = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_TAGLINE,
  applicationName: APP_NAME,
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_TAGLINE,
  },
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
