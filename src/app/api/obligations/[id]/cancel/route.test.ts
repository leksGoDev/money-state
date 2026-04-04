import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { ZodError } from "zod";

vi.mock("@/modules/obligations", () => ({
  cancelObligation: vi.fn(),
}));

import { auth } from "@/auth";
import * as route from "@/app/api/obligations/[id]/cancel/route";
import { cancelObligation } from "@/modules/obligations";

const mockCancelObligation = vi.mocked(cancelObligation);
type CancelRequest = Parameters<typeof route.POST>[0];
type CancelContext = Parameters<typeof route.POST>[1];
type CancelResult = Awaited<ReturnType<typeof cancelObligation>>;

const context: CancelContext = {
  params: Promise.resolve({ id: "ob_1" }),
};

describe("/api/obligations/[id]/cancel route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(auth).mockResolvedValue({ user: { id: "user_1" } } as never);
  });

  it("wires userId, id and payload to cancelObligation", async () => {
    mockCancelObligation.mockResolvedValue(
      { id: "ob_1", status: "canceled" } as unknown as CancelResult,
    );

    const response = await route.POST(
      {
        json: vi.fn(async () => ({ resolvedYear: 2026, resolvedMonth: 4 })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as CancelRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockCancelObligation).toHaveBeenCalledWith("user_1", "ob_1", {
      resolvedYear: 2026,
      resolvedMonth: 4,
    });
  });

  it("returns 400 validation error when cancel payload is invalid", async () => {
    mockCancelObligation.mockRejectedValue(new ZodError([]));

    const response = await route.POST(
      {
        json: vi.fn(async () => ({ resolvedYear: 2026, resolvedMonth: 0 })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as CancelRequest,
      context,
    );

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error.code).toBe("VALIDATION_ERROR");
  });
});
