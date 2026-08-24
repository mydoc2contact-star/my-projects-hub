"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ImageUploader } from "@/components/projects/ImageUploader";
import { LinksField } from "@/components/projects/LinksField";
import { STATUS_OPTIONS } from "@/lib/constants";
import { createProjectAction, updateProjectAction, type ActionResult } from "@/actions/projects";
import type { ProjectStatus } from "@prisma/client";

type ProjectFormValues = {
  id?: string;
  name: string;
  shortDescription: string;
  mainImage?: string | null;
  idea: string;
  problem: string;
  solution: string;
  vision: string;
  goals: string;
  targetAudience: string;
  businessModel: string;
  developmentStages: string;
  notes: string;
  status: ProjectStatus;
  images?: Array<{ id: string; imageUrl: string }>;
  links?: Array<{ title: string; url: string }>;
};

const emptyResult: ActionResult<{ slug: string }> | null = null;

export function ProjectForm({
  mode,
  project,
}: {
  mode: "create" | "edit";
  project?: ProjectFormValues;
}) {
  const router = useRouter();
  const action = mode === "create" ? createProjectAction : updateProjectAction;
  const [state, formAction, pending] = useActionState(action, emptyResult);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(mode === "create" ? "تم إنشاء المشروع بنجاح" : "تم حفظ التعديلات بنجاح");
      router.push(`/projects/${state.data.slug}`);
      return;
    }
    toast.error(state.error);
  }, [state, mode, router]);

  const errors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-6">
      {project?.id ? <input type="hidden" name="id" value={project.id} /> : null}
      <input type="hidden" name="removedImageIds" value={removedImageIds.join(",")} />

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="mb-5 text-base font-semibold">المعلومات الأساسية</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="اسم المشروع" required error={errors?.name}>
            <Input name="name" defaultValue={project?.name} placeholder="مثال: منصة إدارة المهام" />
          </Field>
          <Field label="حالة المشروع" required>
            <Select name="status" defaultValue={project?.status ?? "IDEA"}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="وصف مختصر" required error={errors?.shortDescription}>
              <Textarea
                name="shortDescription"
                defaultValue={project?.shortDescription}
                placeholder="جملة أو جملتان توضّحان المشروع بسرعة"
                className="min-h-24"
              />
            </Field>
          </div>
        </div>
        <div className="mt-6">
          <ImageUploader
            mainImageUrl={project?.mainImage}
            existingImages={project?.images?.map((image) => ({ id: image.id, url: image.imageUrl }))}
            onRemovedExistingChange={setRemovedImageIds}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="mb-5 text-base font-semibold">الاستراتيجية</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="فكرة المشروع">
            <Textarea name="idea" defaultValue={project?.idea} />
          </Field>
          <Field label="المشكلة التي يحلها">
            <Textarea name="problem" defaultValue={project?.problem} />
          </Field>
          <Field label="الحل">
            <Textarea name="solution" defaultValue={project?.solution} />
          </Field>
          <Field label="الرؤية">
            <Textarea name="vision" defaultValue={project?.vision} />
          </Field>
          <Field label="الأهداف">
            <Textarea name="goals" defaultValue={project?.goals} />
          </Field>
          <Field label="الجمهور المستهدف">
            <Textarea name="targetAudience" defaultValue={project?.targetAudience} />
          </Field>
          <Field label="نموذج العمل">
            <Textarea name="businessModel" defaultValue={project?.businessModel} />
          </Field>
          <Field label="مراحل المشروع">
            <Textarea name="developmentStages" defaultValue={project?.developmentStages} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="mb-5 text-base font-semibold">ملاحظات وروابط</h2>
        <Field label="الملاحظات">
          <Textarea name="notes" defaultValue={project?.notes} className="min-h-32" />
        </Field>
        <div className="mt-5">
          <p className="mb-3 text-sm font-medium">الروابط</p>
          <LinksField initialLinks={project?.links} />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={() => router.back()} disabled={pending}>
          إلغاء
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Spinner /> : null}
          {mode === "create" ? "حفظ المشروع" : "حفظ التعديلات"}
        </Button>
      </div>
    </form>
  );
}
