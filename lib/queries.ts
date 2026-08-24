import { Prisma, ProjectStatus } from "@prisma/client";
import { prisma } from "./prisma";
import { isProjectStatus } from "./constants";
import { decodeSlugParam } from "./utils";

export type ProjectListFilters = {
  query?: string;
  status?: string;
  sort?: "newest" | "oldest";
};

export async function getDashboardData() {
  const [total, grouped, recent] = await Promise.all([
    prisma.project.count(),
    prisma.project.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        mainImage: true,
        status: true,
        updatedAt: true,
      },
    }),
  ]);

  const counts = Object.fromEntries(
    grouped.map((row) => [row.status, row._count.status]),
  ) as Partial<Record<ProjectStatus, number>>;

  const byStatus = (status: ProjectStatus) => counts[status] ?? 0;

  return {
    total,
    counts: {
      IDEA: byStatus("IDEA"),
      RESEARCH: byStatus("RESEARCH"),
      FUTURE: byStatus("FUTURE"),
      IN_PROGRESS: byStatus("IN_PROGRESS"),
      PAUSED: byStatus("PAUSED"),
      COMPLETED: byStatus("COMPLETED"),
      CANCELLED: byStatus("CANCELLED"),
    },
    recent,
  };
}

export async function getProjects(filters: ProjectListFilters = {}) {
  const where: Prisma.ProjectWhereInput = {};

  if (filters.status && isProjectStatus(filters.status)) {
    where.status = filters.status;
  }

  const query = filters.query?.trim();
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { shortDescription: { contains: query } },
      { idea: { contains: query } },
    ];
  }

  return prisma.project.findMany({
    where,
    orderBy: { updatedAt: filters.sort === "oldest" ? "asc" : "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      mainImage: true,
      status: true,
      updatedAt: true,
    },
  });
}

export async function getProjectBySlug(slug: string) {
  const decoded = decodeSlugParam(slug);
  return prisma.project.findFirst({
    where: { OR: [{ slug: decoded }, { slug }] },
    include: {
      images: { orderBy: { createdAt: "asc" } },
      links: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      images: { orderBy: { createdAt: "asc" } },
      links: { orderBy: { createdAt: "asc" } },
    },
  });
}
