import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { ZodError } from "zod";

vi.mock("@/modules/obligations", () => ({
  resolveObligation: vi.fn(),
}));

import * as route from "@/app/api/obligations/[id]/resolve/route";
import { resolveObligation } from "@/modules/obligations";

const mockResolveObligation = vi.mocked(resolveObligation);
type ResolveRequest = Parameters<typeof route.POST>[0];
type ResolveContext = Parameters<typeof route.POST>[1];
type ResolveResult = Awaited<ReturnType<typeof resolveObligation>>;

const context: ResolveContext = {
  params: Promise.resolve({ id: "ob_1" }),
};

describe("/api/obligations/[id]/resolve route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("wires userId, id and payload to resolveObligation", async () => {
    mockResolveObligation.mockResolvedValue(
      { obligation: { id: "ob_1" }, conversion: null } as unknown as ResolveResult,
    );

    const response = await route.POST(
      {
        json: vi.fn(async () => ({ resolution: "closed", resolvedYear: 2026, resolvedMonth: 4 })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as ResolveRequest,
      context,
    );

    expect(response.status).toBe(200);
    expect(mockResolveObligation).toHaveBeenCalledWith("user_1", "ob_1", {
      resolution: "closed",
      resolvedYear: 2026,
      resolvedMonth: 4,
    });
  });

  it("returns 400 validation error when payload is invalid", async () => {
    mockResolveObligation.mockRejectedValue(new ZodError([]));

    const response = await route.POST(
      {
        json: vi.fn(async () => ({ resolution: "closed" })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as ResolveRequest,
      context,
    );

    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.error.code).toBe("VALIDATION_ERROR");
  });
});
