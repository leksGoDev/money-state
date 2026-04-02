import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));


vi.mock("@/modules/confirmed/income", () => ({
  deleteIncome: vi.fn(),
  getIncomeById: vi.fn(),
  updateIncome: vi.fn(),
}));

import * as route from "@/app/api/incomes/[id]/route";
import { deleteIncome, getIncomeById, updateIncome } from "@/modules/confirmed/income";

const mockGetIncomeById = vi.mocked(getIncomeById);
const mockUpdateIncome = vi.mocked(updateIncome);
const mockDeleteIncome = vi.mocked(deleteIncome);
type IncomeItemRequest = Parameters<typeof route.GET>[0];
type IncomeItemContext = Parameters<typeof route.GET>[1];
type GetIncomeByIdResult = Awaited<ReturnType<typeof getIncomeById>>;
type UpdateIncomeResult = Awaited<ReturnType<typeof updateIncome>>;
type DeleteIncomeResult = Awaited<ReturnType<typeof deleteIncome>>;

const context: IncomeItemContext = {
  params: Promise.resolve({ id: "inc_1" }),
};

describe("/api/incomes/[id] route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("GET wires userId and id to getIncomeById", async () => {
    mockGetIncomeById.mockResolvedValue({ id: "inc_1" } as unknown as GetIncomeByIdResult);

    const response = await route.GET(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as IncomeItemRequest,
      context,
    );
    expect(response.status).toBe(200);
    expect(mockGetIncomeById).toHaveBeenCalledWith("user_1", "inc_1");
  });

  it("PATCH wires payload to updateIncome", async () => {
    mockUpdateIncome.mockResolvedValue({ id: "inc_1" } as unknown as UpdateIncomeResult);

    const response = await route.PATCH(
      {
        json: vi.fn(async () => ({ title: "Updated" })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as IncomeItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockUpdateIncome).toHaveBeenCalledWith("user_1", "inc_1", {
      title: "Updated",
    });
  });

  it("DELETE wires userId and id to deleteIncome", async () => {
    mockDeleteIncome.mockResolvedValue({ success: true } as unknown as DeleteIncomeResult);

    const response = await route.DELETE(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as IncomeItemRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockDeleteIncome).toHaveBeenCalledWith("user_1", "inc_1");
  });
});
