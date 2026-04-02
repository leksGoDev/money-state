import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({
  requireRequestUserId: vi.fn(() => "user_1"),
}));

vi.mock("@/modules/confirmed/expense", () => ({
  createExpense: vi.fn(async () => ({ id: "exp_1" })),
}));

vi.mock("@/modules/categories", () => ({
  createCategory: vi.fn(async () => ({ id: "cat_1" })),
}));

vi.mock("@/modules/obligations", () => ({
  createObligation: vi.fn(async () => ({ id: "ob_1" })),
}));

import * as expensesRoute from "@/app/api/expenses/route";
import * as categoriesRoute from "@/app/api/categories/route";
import * as obligationsRoute from "@/app/api/obligations/route";
import { requireRequestUserId } from "@/lib/auth/session";
import { createExpense } from "@/modules/confirmed/expense";
import { createCategory } from "@/modules/categories";
import { createObligation } from "@/modules/obligations";

const mockRequireRequestUserId = vi.mocked(requireRequestUserId);
const mockCreateExpense = vi.mocked(createExpense);
const mockCreateCategory = vi.mocked(createCategory);
const mockCreateObligation = vi.mocked(createObligation);
type CreateExpenseResult = Awaited<ReturnType<typeof createExpense>>;
type CreateCategoryResult = Awaited<ReturnType<typeof createCategory>>;
type CreateObligationResult = Awaited<ReturnType<typeof createObligation>>;
type CreateRequest = Parameters<typeof expensesRoute.POST>[0];

describe("api status code contracts", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockRequireRequestUserId.mockReturnValue("user_1");
    mockCreateExpense.mockResolvedValue({ id: "exp_1" } as unknown as CreateExpenseResult);
    mockCreateCategory.mockResolvedValue({ id: "cat_1" } as unknown as CreateCategoryResult);
    mockCreateObligation.mockResolvedValue(
      { id: "ob_1" } as unknown as CreateObligationResult,
    );
  });

  it("returns 201 for create endpoints", async () => {
    const request: CreateRequest = {
      json: async () => ({ title: "x", amount: 1, currency: "USD" }),
      cookies: { get: vi.fn(() => ({ value: "user_1" })) },
      headers: { get: vi.fn() },
    } as unknown as CreateRequest;

    const [expenseRes, categoryRes, obligationRes] = await Promise.all([
      expensesRoute.POST(request),
      categoriesRoute.POST(request),
      obligationsRoute.POST(request),
    ]);

    expect(expenseRes.status).toBe(201);
    expect(categoryRes.status).toBe(201);
    expect(obligationRes.status).toBe(201);
  });
});
