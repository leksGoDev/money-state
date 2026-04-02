import { notFound } from "@/lib/api/server/errors";
import { deleteCategoryRow, findCategoryById } from "@/modules/categories/repository";

export async function deleteCategory(userId: string, categoryId: string) {
  const existing = await findCategoryById(userId, categoryId);

  if (!existing) {
    notFound("Category not found.");
  }

  await deleteCategoryRow(categoryId);
  return { success: true };
}
