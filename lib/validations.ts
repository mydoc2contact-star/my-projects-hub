import { z } from "zod";

const statusEnum = z.enum([
  "IDEA",
  "RESEARCH",
  "FUTURE",
  "IN_PROGRESS",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
]);

export const projectFieldsSchema = z.object({
  name: z.string().trim().min(2, "اسم المشروع مطلوب").max(120, "الاسم طويل جدًا"),
  shortDescription: z
    .string()
    .trim()
    .min(4, "الوصف المختصر مطلوب")
    .max(320, "الوصف المختصر يجب ألا يتجاوز 320 حرفًا"),
  idea: z.string().trim().max(5000).optional().default(""),
  problem: z.string().trim().max(5000).optional().default(""),
  solution: z.string().trim().max(5000).optional().default(""),
  vision: z.string().trim().max(5000).optional().default(""),
  goals: z.string().trim().max(5000).optional().default(""),
  targetAudience: z.string().trim().max(5000).optional().default(""),
  businessModel: z.string().trim().max(5000).optional().default(""),
  developmentStages: z.string().trim().max(5000).optional().default(""),
  notes: z.string().trim().max(8000).optional().default(""),
  status: statusEnum,
});

export const projectLinkSchema = z.object({
  title: z.string().trim().min(1, "عنوان الرابط مطلوب").max(80),
  url: z.string().trim().url("أدخل رابطًا صحيحًا يبدأ بـ http"),
});

export type ProjectFields = z.infer<typeof projectFieldsSchema>;
export type ProjectLinkInput = z.infer<typeof projectLinkSchema>;
