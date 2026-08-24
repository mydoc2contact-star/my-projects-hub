import { ProjectStatus } from "@prisma/client";

export const APP_NAME = "My Projects Hub";
export const APP_TAGLINE = "مكتبة استراتيجية لمشاريعك";

export const APP_URL = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path = "") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return path ? `${APP_URL}${normalized}` : APP_URL;
}

export const STATUS_OPTIONS: Array<{
  value: ProjectStatus;
  label: string;
  description: string;
}> = [
  { value: "IDEA", label: "فكرة", description: "فكرة أولية قيد التبلور" },
  { value: "RESEARCH", label: "قيد الدراسة", description: "يتم بحثها وتحليلها" },
  { value: "FUTURE", label: "مستقبلي", description: "مخطط له لاحقًا" },
  { value: "IN_PROGRESS", label: "قيد التنفيذ", description: "العمل جارٍ عليه" },
  { value: "PAUSED", label: "متوقف", description: "متوقف مؤقتًا" },
  { value: "COMPLETED", label: "مكتمل", description: "اكتمل العمل عليه" },
  { value: "CANCELLED", label: "ملغي", description: "لن يُتابع" },
];

export const STATUS_LABELS: Record<ProjectStatus, string> = Object.fromEntries(
  STATUS_OPTIONS.map((option) => [option.value, option.label]),
) as Record<ProjectStatus, string>;

export function isProjectStatus(value: string): value is ProjectStatus {
  return STATUS_OPTIONS.some((option) => option.value === value);
}
