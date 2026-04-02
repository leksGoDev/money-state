import { prisma } from "@/lib/prisma";
import type { CategoryRow } from "@/modules/categories/types";

export async function findCategories(userId: string): Promise<CategoryRow[]> {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function findCategoryById(
  userId: string,
  categoryId: string,
): Promise<CategoryRow | null> {
  return prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
}

export async function findCategoryByName(
  userId: string,
  name: string,
): Promise<CategoryRow | null> {
  return prisma.category.findFirst({
    where: {
      userId,
      name,
    },
  });
}

export async function findCategoryDuplicateByName(params: {
  userId: string;
  categoryId: string;
  name: string;
}): Promise<CategoryRow | null> {
  return prisma.category.findFirst({
    where: {
      userId: params.userId,
      name: params.name,
      NOT: { id: params.categoryId },
    },
  });
}

export async function createCategoryRow(
  userId: string,
  name: string,
): Promise<CategoryRow> {
  return prisma.category.create({
    data: {
      userId,
      name,
    },
  });
}

export async function updateCategoryRow(
  categoryId: string,
  name: string,
): Promise<CategoryRow> {
  return prisma.category.update({
    where: { id: categoryId },
    data: { name },
  });
}

export async function deleteCategoryRow(categoryId: string): Promise<void> {
  await prisma.category.delete({
    where: { id: categoryId },
  });
}
