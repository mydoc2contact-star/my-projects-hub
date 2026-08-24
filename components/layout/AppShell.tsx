"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, LayoutDashboard, Plus } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/projects", label: "المشاريع", icon: FolderKanban },
  { href: "/projects/new", label: "إضافة مشروع", icon: Plus },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-l border-line bg-white lg:flex">
      <div className="border-b border-line px-6 py-6">
        <p className="text-lg font-semibold text-primary">{APP_NAME}</p>
        <p className="mt-1 text-sm text-muted">{APP_TAGLINE}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href === "/projects"
                ? pathname === "/projects"
                : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-primary text-white" : "text-ink hover:bg-page",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href === "/projects"
                ? pathname === "/projects"
                : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium",
                active ? "bg-primary-soft text-primary" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-24 lg:pb-0">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
