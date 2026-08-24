import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";
import { StatusChanger } from "@/components/projects/StatusChanger";
import { getProjectBySlug } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "المشروع غير موجود" };
  return { title: project.name, description: project.shortDescription };
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">
        {content.trim() ? content : "لم تُضف معلومات هنا بعد."}
      </p>
    </section>
  );
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="relative h-56 bg-primary-soft sm:h-72">
          {project.mainImage ? (
            <Image
              src={project.mainImage}
              alt={project.name}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">لا توجد صورة رئيسية</div>
          )}
        </div>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold sm:text-2xl">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="max-w-2xl text-sm leading-6 text-muted">{project.shortDescription}</p>
            <p className="text-xs text-muted">
              أُنشئ في {formatDateTime(project.createdAt)} · آخر تحديث {formatDateTime(project.updatedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href={`/projects/${project.slug}/edit`}>تعديل المشروع</Button>
            <StatusChanger id={project.id} status={project.status} />
            <DeleteProjectButton id={project.id} name={project.name} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="1. فكرة المشروع" content={project.idea} />
        <Section title="2. المشكلة" content={project.problem} />
        <Section title="3. الحل" content={project.solution} />
        <Section title="4. الرؤية" content={project.vision} />
        <Section title="5. الأهداف" content={project.goals} />
        <Section title="6. الجمهور المستهدف" content={project.targetAudience} />
        <Section title="7. نموذج العمل" content={project.businessModel} />
        <Section title="8. مراحل المشروع" content={project.developmentStages} />
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold">9. الصور</h2>
        {project.images.length === 0 ? (
          <p className="mt-3 text-sm text-muted">لا توجد صور إضافية.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {project.images.map((image) => (
              <div key={image.id} className="relative h-32 overflow-hidden rounded-xl border border-line">
                <Image src={image.imageUrl} alt="" fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        )}
      </section>

      <Section title="10. الملاحظات" content={project.notes} />

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold">11. الروابط</h2>
        {project.links.length === 0 ? (
          <p className="mt-3 text-sm text-muted">لا توجد روابط محفوظة.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {project.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
