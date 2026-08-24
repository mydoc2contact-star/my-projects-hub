import { CheckCircle2, FolderKanban, Lightbulb, Rocket, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard, StatusBreakdown } from "@/components/dashboard/Stats";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDashboardData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <PageHeader
        title="لوحة التحكم"
        description="نظرة سريعة على مكتبتك الاستراتيجية: أين تقف مشاريعك، وما الذي يحتاج متابعة."
        actionHref="/projects/new"
        actionLabel="+ إضافة مشروع"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="إجمالي المشاريع" value={data.total} icon={FolderKanban} />
        <StatCard label="أفكار" value={data.counts.IDEA} icon={Lightbulb} />
        <StatCard label="قيد الدراسة" value={data.counts.RESEARCH} icon={Search} />
        <StatCard label="قيد التنفيذ" value={data.counts.IN_PROGRESS} icon={Rocket} />
        <StatCard label="مكتملة" value={data.counts.COMPLETED} icon={CheckCircle2} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard label="مشاريع مستقبلية" value={data.counts.FUTURE} icon={FolderKanban} />
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="متوقفة" value={data.counts.PAUSED} icon={FolderKanban} />
          <StatCard label="ملغاة" value={data.counts.CANCELLED} icon={FolderKanban} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h2 className="mb-4 text-lg font-semibold">آخر المشاريع</h2>
          {data.recent.length === 0 ? (
            <EmptyState
              title="لا توجد مشاريع بعد"
              description="ابدأ بإضافة أول مشروع لبناء مكتبتك الاستراتيجية."
              actionHref="/projects/new"
              actionLabel="+ إضافة مشروع"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.recent.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
        <StatusBreakdown counts={data.counts} total={data.total} />
      </div>
    </div>
  );
}
