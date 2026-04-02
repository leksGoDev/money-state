import type { Category } from "@prisma/client";

export type CategoryRow = Category;

export type CategoryDto = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
