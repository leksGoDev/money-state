import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/modules/categories", () => ({
  deleteCategory: vi.fn(),
  getCategoryById: vi.fn(),
  updateCategory: vi.fn(),
}));

import * as route from "@/app/api/categories/[id]/route";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/modules/categories";

type CategoryItemRequest = Parameters<typeof route.GET>[0];
type CategoryItemContext = Parameters<typeof route.GET>[1];
type GetCategoryResult = Awaited<ReturnType<typeof getCategoryById>>;
type UpdateCategoryResult = Awaited<ReturnType<typeof updateCategory>>;
type DeleteCategoryResult = Awaited<ReturnType<typeof deleteCategory>>;

const mockGetCategoryById = vi.mocked(getCategoryById);
const mockUpdateCategory = vi.mocked(updateCategory);
const mockDeleteCategory = vi.mocked(deleteCategory);

const context: CategoryItemContext = {
  params: Promise.resolve({ id: "cat_1" }),
};

describe("/api/categories/[id] route", () => {
  beforeEach(() => vi.resetAllMocks());

  it("GET wires userId and id", async () => {
    mockGetCategoryById.mockResolvedValue({ id: "cat_1" } as unknown as GetCategoryResult);

    const response = await route.GET(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as CategoryItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockGetCategoryById).toHaveBeenCalledWith("user_1", "cat_1");
  });

  it("PATCH wires payload", async () => {
    mockUpdateCategory.mockResolvedValue({ id: "cat_1" } as unknown as UpdateCategoryResult);

    const response = await route.PATCH(
      {
        json: vi.fn(async () => ({ name: "Updated" })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as CategoryItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockUpdateCategory).toHaveBeenCalledWith("user_1", "cat_1", { name: "Updated" });
  });

  it("DELETE wires userId and id", async () => {
    mockDeleteCategory.mockResolvedValue(
      { success: true } as unknown as DeleteCategoryResult,
    );

    const response = await route.DELETE(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as CategoryItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockDeleteCategory).toHaveBeenCalledWith("user_1", "cat_1");
  });
});
