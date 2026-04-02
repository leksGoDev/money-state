import { conflict } from "@/lib/api/server/errors";
import { createCategoryRow, findCategoryByName } from "@/modules/categories/repository";
import { toCategoryDto } from "@/modules/categories/mappers";
import { categoryCreateSchema } from "@/modules/categories/schemas";

export async function createCategory(userId: string, payload: unknown) {
  const input = categoryCreateSchema.parse(payload);
  const existing = await findCategoryByName(userId, input.name);

  if (existing) {
    conflict("Category with the same name already exists.");
  }

  const created = await createCategoryRow(userId, input.name);
  return toCategoryDto(created);
}
