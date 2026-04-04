import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));


vi.mock("@/modules/confirmed/income", () => ({
  createIncome: vi.fn(),
  listIncomes: vi.fn(),
}));

import { auth } from "@/auth";

type MockAuthSession = { user?: { id?: string } } | null;
const mockAuth = vi.mocked(
  auth as unknown as () => Promise<MockAuthSession>,
);
import * as route from "@/app/api/incomes/route";
import { createIncome, listIncomes } from "@/modules/confirmed/income";

const mockCreateIncome = vi.mocked(createIncome);
const mockListIncomes = vi.mocked(listIncomes);
type IncomesRequest = Parameters<typeof route.GET>[0];
type ListIncomesResult = Awaited<ReturnType<typeof listIncomes>>;
type CreateIncomeResult = Awaited<ReturnType<typeof createIncome>>;

describe("/api/incomes route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
  });

  it("GET passes userId and parsed query to listIncomes", async () => {
    mockListIncomes.mockResolvedValue([{ id: "inc_1" }] as unknown as ListIncomesResult);

    const request: IncomesRequest = {
      nextUrl: {
        searchParams: new URLSearchParams([
          ["search", "salary"],
          ["activeInYear", "2026"],
        ]),
      },
      cookies: { get: vi.fn() },
      headers: { get: vi.fn() },
    } as unknown as IncomesRequest;
    vi.mocked(request.cookies.get).mockReturnValue(
      { value: "user_1" } as unknown as ReturnType<typeof request.cookies.get>,
    );

    const response = await route.GET(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(mockListIncomes).toHaveBeenCalledWith("user_1", {
      search: "salary",
      activeInYear: "2026",
    });
    expect(payload[0].id).toBe("inc_1");
  });

  it("POST returns 201 and forwards request payload", async () => {
    mockCreateIncome.mockResolvedValue({ id: "inc_2" } as unknown as CreateIncomeResult);

    const request: IncomesRequest = {
      json: vi.fn(async () => ({ title: "Salary", amount: 1000 })),
      cookies: { get: vi.fn() },
      headers: { get: vi.fn() },
    } as unknown as IncomesRequest;
    vi.mocked(request.cookies.get).mockReturnValue(
      { value: "user_1" } as unknown as ReturnType<typeof request.cookies.get>,
    );

    const response = await route.POST(request);

    expect(response.status).toBe(201);
    expect(mockCreateIncome).toHaveBeenCalledWith("user_1", {
      title: "Salary",
      amount: 1000,
    });
  });
});
