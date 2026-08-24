import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-line bg-white p-8 text-center">
      <h2 className="text-lg font-semibold">الصفحة غير موجودة</h2>
      <p className="mt-2 text-sm text-muted">قد يكون المشروع محذوفًا أو الرابط غير صحيح.</p>
      <div className="mt-5 flex justify-center">
        <Button href="/projects">العودة إلى المشاريع</Button>
      </div>
    </div>
  );
}
