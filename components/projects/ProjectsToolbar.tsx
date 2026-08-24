"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";
import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { STATUS_OPTIONS } from "@/lib/constants";

export function ProjectsToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const q = String(form.get("q") ?? "").trim();
    const status = String(form.get("status") ?? "");
    const sort = String(form.get("sort") ?? "newest");
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (sort && sort !== "newest") params.set("sort", sort);
    const query = params.toString();
    router.push(query ? `/projects?${query}` : "/projects");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-[1fr_180px_160px_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          name="q"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="ابحث بالاسم أو الوصف أو الفكرة"
          className="ps-10"
        />
      </div>
      <Select name="status" defaultValue={searchParams.get("status") ?? ""}>
        <option value="">كل الحالات</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Select name="sort" defaultValue={searchParams.get("sort") ?? "newest"}>
        <option value="newest">الأحدث تحديثًا</option>
        <option value="oldest">الأقدم تحديثًا</option>
      </Select>
      <Button type="submit">تطبيق</Button>
    </form>
  );
}
