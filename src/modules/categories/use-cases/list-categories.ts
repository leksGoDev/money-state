import { findCategories } from "@/modules/categories/repository";
import { toCategoryDto } from "@/modules/categories/mappers";

export async function listCategories(userId: string) {
  const rows = await findCategories(userId);
  return rows.map(toCategoryDto);
}
