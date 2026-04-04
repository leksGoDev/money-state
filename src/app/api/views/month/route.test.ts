import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/server/errors";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));


vi.mock("@/modules/views", () => ({
  getMonthView: vi.fn(),
}));

import { auth } from "@/auth";
import * as route from "@/app/api/views/month/route";
import { getMonthView } from "@/modules/views";

const mockGetMonthView = vi.mocked(getMonthView);
type MonthViewRequest = Parameters<typeof route.GET>[0];
type MonthViewResult = Awaited<ReturnType<typeof getMonthView>>;

describe("/api/views/month route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(auth).mockResolvedValue({ user: { id: "user_1" } } as never);
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

  it("returns 400 when month view query is invalid", async () => {
    mockGetMonthView.mockRejectedValue(
      new ApiError({
        status: 400,
        code: "BAD_REQUEST",
        message: "Invalid month view query.",
      }),
    );

    const request: MonthViewRequest = {
      nextUrl: {
        searchParams: new URLSearchParams([["year", "wrong"]]),
      },
      cookies: { get: vi.fn(() => ({ value: "user_1" })) },
      headers: { get: vi.fn() },
    } as unknown as MonthViewRequest;

    const response = await route.GET(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });
});
