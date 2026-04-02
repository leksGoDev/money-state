import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/modules/confirmed/expense", () => ({
  deleteExpense: vi.fn(),
  getExpenseById: vi.fn(),
  updateExpense: vi.fn(),
}));

import * as route from "@/app/api/expenses/[id]/route";
import { deleteExpense, getExpenseById, updateExpense } from "@/modules/confirmed/expense";

type ExpenseItemRequest = Parameters<typeof route.GET>[0];
type ExpenseItemContext = Parameters<typeof route.GET>[1];
type GetExpenseResult = Awaited<ReturnType<typeof getExpenseById>>;
type UpdateExpenseResult = Awaited<ReturnType<typeof updateExpense>>;
type DeleteExpenseResult = Awaited<ReturnType<typeof deleteExpense>>;

const mockGetExpenseById = vi.mocked(getExpenseById);
const mockUpdateExpense = vi.mocked(updateExpense);
const mockDeleteExpense = vi.mocked(deleteExpense);

const context: ExpenseItemContext = { params: Promise.resolve({ id: "exp_1" }) };

describe("/api/expenses/[id] route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET wires userId and id", async () => {
    mockGetExpenseById.mockResolvedValue({ id: "exp_1" } as unknown as GetExpenseResult);

    const response = await route.GET(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as ExpenseItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockGetExpenseById).toHaveBeenCalledWith("user_1", "exp_1");
  });

  it("PATCH wires payload", async () => {
    mockUpdateExpense.mockResolvedValue({ id: "exp_1" } as unknown as UpdateExpenseResult);

    const response = await route.PATCH(
      {
        json: vi.fn(async () => ({ title: "Updated" })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as ExpenseItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockUpdateExpense).toHaveBeenCalledWith("user_1", "exp_1", { title: "Updated" });
  });

  it("DELETE wires userId and id", async () => {
    mockDeleteExpense.mockResolvedValue({ success: true } as unknown as DeleteExpenseResult);

    const response = await route.DELETE(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as ExpenseItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockDeleteExpense).toHaveBeenCalledWith("user_1", "exp_1");
  });
});
