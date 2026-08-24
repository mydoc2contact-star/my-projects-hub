import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectForm } from "@/components/projects/ProjectForm";

export const metadata = {
  title: "إضافة مشروع",
};

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader
        title="إضافة مشروع"
        description="أدخل معلومات المشروع مرة واحدة، ثم عد إليها في أي وقت لتحديث الحالة والتفاصيل."
      />
      <ProjectForm mode="create" />
    </div>
  );
}
