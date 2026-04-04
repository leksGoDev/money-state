import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/modules/categories", () => ({
  createCategory: vi.fn(),
  listCategories: vi.fn(),
}));

import { auth } from "@/auth";
import * as route from "@/app/api/categories/route";
import { createCategory, listCategories } from "@/modules/categories";

type CategoriesRequest = Parameters<typeof route.GET>[0];
type ListCategoriesResult = Awaited<ReturnType<typeof listCategories>>;
type CreateCategoryResult = Awaited<ReturnType<typeof createCategory>>;

const mockCreateCategory = vi.mocked(createCategory);
const mockListCategories = vi.mocked(listCategories);

describe("/api/categories route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(auth).mockResolvedValue({ user: { id: "user_1" } } as never);
  });

  it("GET wires userId", async () => {
    mockListCategories.mockResolvedValue([{ id: "cat_1" }] as unknown as ListCategoriesResult);

    const response = await route.GET(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as CategoriesRequest,
    );

    expect(response.status).toBe(200);
    expect(mockListCategories).toHaveBeenCalledWith("user_1");
  });

  it("POST returns 201 and forwards payload", async () => {
    mockCreateCategory.mockResolvedValue({ id: "cat_2" } as unknown as CreateCategoryResult);

    const response = await route.POST(
      {
        json: vi.fn(async () => ({ name: "Home" })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as CategoriesRequest,
    );

    expect(response.status).toBe(201);
    expect(mockCreateCategory).toHaveBeenCalledWith("user_1", { name: "Home" });
  });
});
