import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));


vi.mock("@/modules/views", () => ({
  getMonthView: vi.fn(),
}));

import * as route from "@/app/api/views/month/route";
import { getMonthView } from "@/modules/views";

const mockGetMonthView = vi.mocked(getMonthView);
type MonthViewRequest = Parameters<typeof route.GET>[0];
type MonthViewResult = Awaited<ReturnType<typeof getMonthView>>;

describe("/api/views/month route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("passes parsed query object to month view use-case", async () => {
    mockGetMonthView.mockResolvedValue(
      { period: { year: 2026, month: 4 } } as unknown as MonthViewResult,
    );

    const request: MonthViewRequest = {
      nextUrl: {
        searchParams: new URLSearchParams([
          ["year", "2026"],
          ["month", "4"],
          ["expectedWindow", "1"],
        ]),
      },
      cookies: { get: vi.fn(() => ({ value: "user_1" })) },
      headers: { get: vi.fn() },
    } as unknown as MonthViewRequest;

    const response = await route.GET(request);

    expect(response.status).toBe(200);
    expect(mockGetMonthView).toHaveBeenCalledWith("user_1", {
      year: "2026",
      month: "4",
      expectedWindow: "1",
    });
  });
});
