import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/server/errors";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));


vi.mock("@/modules/views", () => ({
  getYearView: vi.fn(),
}));

import { auth } from "@/auth";

type MockAuthSession = { user?: { id?: string } } | null;
const mockAuth = vi.mocked(
  auth as unknown as () => Promise<MockAuthSession>,
);
import * as route from "@/app/api/views/year/route";
import { getYearView } from "@/modules/views";

const mockGetYearView = vi.mocked(getYearView);
type YearViewRequest = Parameters<typeof route.GET>[0];
type YearViewResult = Awaited<ReturnType<typeof getYearView>>;

describe("/api/views/year route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
  });

  it("passes parsed query object to year view use-case", async () => {
    mockGetYearView.mockResolvedValue({ year: 2026 } as unknown as YearViewResult);

    const request: YearViewRequest = {
      nextUrl: {
        searchParams: new URLSearchParams([
          ["year", "2026"],
          ["expectedWindow", "2"],
        ]),
      },
      cookies: { get: vi.fn(() => ({ value: "user_1" })) },
      headers: { get: vi.fn() },
    } as unknown as YearViewRequest;

    const response = await route.GET(request);

    expect(response.status).toBe(200);
    expect(mockGetYearView).toHaveBeenCalledWith("user_1", {
      year: "2026",
      expectedWindow: "2",
    });
  });

  it("returns 400 when year view query is invalid", async () => {
    mockGetYearView.mockRejectedValue(
      new ApiError({
        status: 400,
        code: "BAD_REQUEST",
        message: "Invalid year view query.",
      }),
    );

    const request: YearViewRequest = {
      nextUrl: {
        searchParams: new URLSearchParams([["year", "abcd"]]),
      },
      cookies: { get: vi.fn(() => ({ value: "user_1" })) },
      headers: { get: vi.fn() },
    } as unknown as YearViewRequest;

    const response = await route.GET(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("BAD_REQUEST");
  });
});
