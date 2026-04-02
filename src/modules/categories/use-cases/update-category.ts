import { conflict, notFound } from "@/lib/api/server/errors";
import {
  findCategoryById,
  findCategoryDuplicateByName,
  updateCategoryRow,
} from "@/modules/categories/repository";
import { categoryCreateSchema } from "@/modules/categories/schemas";
import { toCategoryDto } from "@/modules/categories/mappers";

export async function updateCategory(
  userId: string,
  categoryId: string,
  payload: unknown,
) {
  const input = categoryCreateSchema.parse(payload);
  const existing = await findCategoryById(userId, categoryId);

  if (!existing) {
    notFound("Category not found.");
  }

  const duplicate = await findCategoryDuplicateByName({
    userId,
    categoryId,
    name: input.name,
  });

  if (duplicate) {
    conflict("Category with the same name already exists.");
  }

  const updated = await updateCategoryRow(categoryId, input.name);
  return toCategoryDto(updated);
}
