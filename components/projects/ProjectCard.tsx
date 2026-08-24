import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { ProjectStatus } from "@prisma/client";

export type ProjectCardData = {
  name: string;
  slug: string;
  shortDescription: string;
  mainImage: string | null;
  status: ProjectStatus;
  updatedAt: Date;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-44 bg-primary-soft">
        {project.mainImage ? (
          <Image
            src={project.mainImage}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">بدون صورة</div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-ink">{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="line-clamp-2 min-h-10 text-sm leading-6 text-muted">{project.shortDescription}</p>
        <div className="flex items-center justify-between text-xs text-muted">
          <span>آخر تحديث: {formatDate(project.updatedAt)}</span>
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            فتح المشروع
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
