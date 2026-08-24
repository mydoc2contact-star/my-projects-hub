"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-8 text-center">
      <h2 className="text-lg font-semibold">حدث خطأ غير متوقع</h2>
      <p className="mt-2 text-sm text-muted">تعذر تحميل الصفحة. حاول مرة أخرى.</p>
      <div className="mt-5 flex justify-center">
        <Button onClick={reset}>إعادة المحاولة</Button>
      </div>
    </div>
  );
}
