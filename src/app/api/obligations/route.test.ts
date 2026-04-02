import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/modules/obligations", () => ({
  createObligation: vi.fn(),
  listObligations: vi.fn(),
}));

import * as route from "@/app/api/obligations/route";
import {
  createObligation,
  listObligations,
} from "@/modules/obligations";

type ObligationsRequest = Parameters<typeof route.GET>[0];
type ListObligationsResult = Awaited<ReturnType<typeof listObligations>>;
type CreateObligationResult = Awaited<ReturnType<typeof createObligation>>;

const mockCreateObligation = vi.mocked(createObligation);
const mockListObligations = vi.mocked(listObligations);

describe("/api/obligations route", () => {
  beforeEach(() => vi.resetAllMocks());

  it("GET passes userId and parsed query to listObligations", async () => {
    mockListObligations.mockResolvedValue(
      [{ id: "ob_1" }] as unknown as ListObligationsResult,
    );

    const request: ObligationsRequest = {
      nextUrl: {
        searchParams: new URLSearchParams([
          ["status", "active"],
          ["currency", "USD"],
        ]),
      },
      cookies: { get: vi.fn(() => ({ value: "user_1" })) },
      headers: { get: vi.fn() },
    } as unknown as ObligationsRequest;

    const response = await route.GET(request);

    expect(response.status).toBe(200);
    expect(mockListObligations).toHaveBeenCalledWith("user_1", {
      status: "active",
      currency: "USD",
    });
  });

  it("POST returns 201 and forwards payload", async () => {
    mockCreateObligation.mockResolvedValue(
      { id: "ob_2" } as unknown as CreateObligationResult,
    );

    const request: ObligationsRequest = {
      json: vi.fn(async () => ({
        type: "debt",
        title: "Credit card",
        amount: 1200,
      })),
      cookies: { get: vi.fn(() => ({ value: "user_1" })) },
      headers: { get: vi.fn() },
    } as unknown as ObligationsRequest;

    const response = await route.POST(request);

    expect(response.status).toBe(201);
    expect(mockCreateObligation).toHaveBeenCalledWith("user_1", {
      type: "debt",
      title: "Credit card",
      amount: 1200,
    });
  });
});
