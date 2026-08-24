import { ProjectStatus } from "@prisma/client";
import { STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  IDEA: "bg-slate-100 text-slate-700",
  RESEARCH: "bg-sky-50 text-sky-800",
  FUTURE: "bg-indigo-50 text-indigo-800",
  IN_PROGRESS: "bg-amber-50 text-amber-800",
  PAUSED: "bg-orange-50 text-orange-800",
  COMPLETED: "bg-emerald-50 text-emerald-800",
  CANCELLED: "bg-red-50 text-red-700",
};

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
