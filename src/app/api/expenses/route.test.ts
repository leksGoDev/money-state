import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/modules/confirmed/expense", () => ({
  createExpense: vi.fn(),
  listExpenses: vi.fn(),
}));

import { auth } from "@/auth";
import * as route from "@/app/api/expenses/route";
import { createExpense, listExpenses } from "@/modules/confirmed/expense";

type ExpensesRequest = Parameters<typeof route.GET>[0];
type ListExpensesResult = Awaited<ReturnType<typeof listExpenses>>;
type CreateExpenseResult = Awaited<ReturnType<typeof createExpense>>;

const mockCreateExpense = vi.mocked(createExpense);
const mockListExpenses = vi.mocked(listExpenses);

describe("/api/expenses route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(auth).mockResolvedValue({ user: { id: "user_1" } } as never);
  });

  it("GET passes userId and parsed query to listExpenses", async () => {
    mockListExpenses.mockResolvedValue([{ id: "exp_1" }] as unknown as ListExpensesResult);

    const request: ExpensesRequest = {
      nextUrl: {
        searchParams: new URLSearchParams([
          ["search", "rent"],
          ["activeInYear", "2026"],
        ]),
      },
      cookies: { get: vi.fn(() => ({ value: "user_1" })) },
      headers: { get: vi.fn() },
    } as unknown as ExpensesRequest;

    const response = await route.GET(request);

    expect(response.status).toBe(200);
    expect(mockListExpenses).toHaveBeenCalledWith("user_1", {
      search: "rent",
      activeInYear: "2026",
    });
  });

  it("POST returns 201 and forwards payload", async () => {
    mockCreateExpense.mockResolvedValue({ id: "exp_2" } as unknown as CreateExpenseResult);

    const request: ExpensesRequest = {
      json: vi.fn(async () => ({ title: "Rent", amount: 500 })),
      cookies: { get: vi.fn(() => ({ value: "user_1" })) },
      headers: { get: vi.fn() },
    } as unknown as ExpensesRequest;

    const response = await route.POST(request);

    expect(response.status).toBe(201);
    expect(mockCreateExpense).toHaveBeenCalledWith("user_1", {
      title: "Rent",
      amount: 500,
    });
  });
});
