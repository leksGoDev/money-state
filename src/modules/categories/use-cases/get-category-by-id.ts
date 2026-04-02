import { notFound } from "@/lib/api/server/errors";
import { findCategoryById } from "@/modules/categories/repository";
import { toCategoryDto } from "@/modules/categories/mappers";

export async function getCategoryById(userId: string, categoryId: string) {
  const row = await findCategoryById(userId, categoryId);

  if (!row) {
    notFound("Category not found.");
  }

  return toCategoryDto(row);
}
