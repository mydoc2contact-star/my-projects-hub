import { STATUS_LABELS } from "@/lib/constants";
import type { ProjectStatus } from "@prisma/client";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className="rounded-xl bg-primary-soft p-2 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

export function StatusBreakdown({
  counts,
  total,
}: {
  counts: Record<ProjectStatus, number>;
  total: number;
}) {
  const rows = (Object.keys(STATUS_LABELS) as ProjectStatus[]).map((status) => ({
    status,
    label: STATUS_LABELS[status],
    value: counts[status],
  }));

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">توزيع المشاريع حسب الحالة</h2>
      <div className="mt-5 space-y-3">
        {rows.map((row) => {
          const percent = total === 0 ? 0 : Math.round((row.value / total) * 100);
          return (
            <div key={row.status}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{row.label}</span>
                <span className="text-muted">
                  {row.value} · {percent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-page">
                <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
