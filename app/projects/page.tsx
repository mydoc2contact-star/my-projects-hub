import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsToolbar } from "@/components/projects/ProjectsToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { getProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const projects = await getProjects({
    query: params.q,
    status: params.status,
    sort: params.sort === "oldest" ? "oldest" : "newest",
  });

  return (
    <div>
      <PageHeader
        title="المشاريع"
        description="كل مشاريعك في مكان واحد. ابحث، صفِّ حسب الحالة، وافتح أي مشروع للعودة إلى تفاصيله."
        actionHref="/projects/new"
        actionLabel="+ إضافة مشروع"
      />
      <Suspense>
        <ProjectsToolbar />
      </Suspense>
      <div className="mt-6">
        {projects.length === 0 ? (
          <EmptyState
            title="لا توجد نتائج"
            description="لم يتم العثور على مشاريع بهذه عوامل التصفية. جرّب بحثًا مختلفًا أو أضف مشروعًا جديدًا."
            actionHref="/projects/new"
            actionLabel="+ إضافة مشروع"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
