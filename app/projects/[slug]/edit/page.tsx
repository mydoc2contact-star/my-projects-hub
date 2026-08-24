import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getProjectBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div>
      <PageHeader title="تعديل المشروع" description={`تحديث بيانات ${project.name}`} />
      <ProjectForm
        mode="edit"
        project={{
          id: project.id,
          name: project.name,
          shortDescription: project.shortDescription,
          mainImage: project.mainImage,
          idea: project.idea,
          problem: project.problem,
          solution: project.solution,
          vision: project.vision,
          goals: project.goals,
          targetAudience: project.targetAudience,
          businessModel: project.businessModel,
          developmentStages: project.developmentStages,
          notes: project.notes,
          status: project.status,
          images: project.images,
          links: project.links,
        }}
      />
    </div>
  );
}
