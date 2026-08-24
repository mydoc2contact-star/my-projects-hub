"use server";

import { revalidatePath } from "next/cache";
import { ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { createSlug } from "@/lib/utils";
import { isProjectStatus } from "@/lib/constants";
import { projectFieldsSchema, projectLinkSchema } from "@/lib/validations";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseLinks(formData: FormData) {
  const raw = getString(formData, "links");
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => projectLinkSchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => result.data);
  } catch {
    return [];
  }
}

function parseFields(formData: FormData) {
  return projectFieldsSchema.safeParse({
    name: getString(formData, "name"),
    shortDescription: getString(formData, "shortDescription"),
    idea: getString(formData, "idea"),
    problem: getString(formData, "problem"),
    solution: getString(formData, "solution"),
    vision: getString(formData, "vision"),
    goals: getString(formData, "goals"),
    targetAudience: getString(formData, "targetAudience"),
    businessModel: getString(formData, "businessModel"),
    developmentStages: getString(formData, "developmentStages"),
    notes: getString(formData, "notes"),
    status: getString(formData, "status"),
  });
}

function flattenFieldErrors(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

async function saveImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return null;
  return storage.upload(file);
}

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  if (slug) {
    revalidatePath(`/projects/${slug}`);
    revalidatePath(`/projects/${slug}/edit`);
  }
}

export async function createProjectAction(
  _prev: ActionResult<{ slug: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ slug: string }>> {
  try {
    const parsed = parseFields(formData);
    if (!parsed.success) {
      return {
        ok: false,
        error: "يرجى تصحيح الحقول المطلوبة.",
        fieldErrors: flattenFieldErrors(parsed.error),
      };
    }

    const mainImage = await saveImage(formData.get("mainImage"));
    const additionalFiles = formData.getAll("additionalImages");
    const additionalImages = (
      await Promise.all(additionalFiles.map((file) => saveImage(file)))
    ).filter((file): file is NonNullable<typeof file> => Boolean(file));

    const links = parseLinks(formData);
    const slug = createSlug(parsed.data.name);

    const project = await prisma.project.create({
      data: {
        ...parsed.data,
        slug,
        mainImage: mainImage?.url,
        images: {
          create: additionalImages.map((image) => ({ imageUrl: image.url })),
        },
        links: {
          create: links,
        },
      },
    });

    revalidateProjectPaths(project.slug);
    return { ok: true, data: { slug: project.slug } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر إنشاء المشروع.";
    return { ok: false, error: message };
  }
}

export async function updateProjectAction(
  _prev: ActionResult<{ slug: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ slug: string }>> {
  try {
    const id = getString(formData, "id");
    if (!id) return { ok: false, error: "المشروع غير موجود." };

    const existing = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) return { ok: false, error: "المشروع غير موجود." };

    const parsed = parseFields(formData);
    if (!parsed.success) {
      return {
        ok: false,
        error: "يرجى تصحيح الحقول المطلوبة.",
        fieldErrors: flattenFieldErrors(parsed.error),
      };
    }

    const newMainImage = await saveImage(formData.get("mainImage"));
    if (newMainImage && existing.mainImage) {
      await storage.remove(existing.mainImage);
    }

    const removedImageIds = getString(formData, "removedImageIds")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (removedImageIds.length > 0) {
      const toRemove = existing.images.filter((image) => removedImageIds.includes(image.id));
      await Promise.all(toRemove.map((image) => storage.remove(image.imageUrl)));
      await prisma.projectImage.deleteMany({
        where: { id: { in: removedImageIds }, projectId: existing.id },
      });
    }

    const additionalFiles = formData.getAll("additionalImages");
    const additionalImages = (
      await Promise.all(additionalFiles.map((file) => saveImage(file)))
    ).filter((file): file is NonNullable<typeof file> => Boolean(file));

    const links = parseLinks(formData);

    const project = await prisma.project.update({
      where: { id: existing.id },
      data: {
        ...parsed.data,
        mainImage: newMainImage?.url ?? existing.mainImage,
        images: {
          create: additionalImages.map((image) => ({ imageUrl: image.url })),
        },
        links: {
          deleteMany: {},
          create: links,
        },
      },
    });

    revalidateProjectPaths(project.slug);
    return { ok: true, data: { slug: project.slug } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر تحديث المشروع.";
    return { ok: false, error: message };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!project) return { ok: false, error: "المشروع غير موجود." };

    const imageUrls = [
      project.mainImage,
      ...project.images.map((image) => image.imageUrl),
    ].filter((url): url is string => Boolean(url));

    await prisma.project.delete({ where: { id } });
    await Promise.all(imageUrls.map((url) => storage.remove(url)));

    revalidateProjectPaths();
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "تعذر حذف المشروع." };
  }
}

export async function updateProjectStatusAction(
  id: string,
  status: string,
): Promise<ActionResult<{ status: ProjectStatus }>> {
  if (!isProjectStatus(status)) {
    return { ok: false, error: "حالة غير صالحة." };
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: { status },
    });
    revalidateProjectPaths(project.slug);
    return { ok: true, data: { status: project.status } };
  } catch {
    return { ok: false, error: "تعذر تغيير حالة المشروع." };
  }
}
