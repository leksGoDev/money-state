import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/exchange-rates", () => ({
  refreshLatestExchangeRates: vi.fn(),
}));

import * as route from "@/app/api/exchange-rates/refresh/route";
import { refreshLatestExchangeRates } from "@/modules/exchange-rates";

const mockRefreshLatestExchangeRates = vi.mocked(refreshLatestExchangeRates);
type RefreshRequest = Parameters<typeof route.POST>[0];
type RefreshResult = Awaited<ReturnType<typeof refreshLatestExchangeRates>>;

describe("/api/exchange-rates/refresh route", () => {
  const previousToken = process.env.SERVICE_API_TOKEN;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env.SERVICE_API_TOKEN = "service-token";
  });

  afterEach(() => {
    process.env.SERVICE_API_TOKEN = previousToken;
  });

  it("returns 401 when authorization header is missing", async () => {
    const request = new Request("http://localhost/api/exchange-rates/refresh", {
      method: "POST",
    });

    const response = await route.POST(request as unknown as RefreshRequest);
    expect(response.status).toBe(401);
  });

  it("returns 401 when bearer token is invalid", async () => {
    const request = new Request("http://localhost/api/exchange-rates/refresh", {
      method: "POST",
      headers: {
        authorization: "Bearer wrong-token",
      },
    });

    const response = await route.POST(request as unknown as RefreshRequest);
    expect(response.status).toBe(401);
  });

  it("returns 200 and triggers refresh on valid service token", async () => {
    mockRefreshLatestExchangeRates.mockResolvedValue(
      { refreshed: true } as unknown as RefreshResult,
    );

    const request = new Request("http://localhost/api/exchange-rates/refresh", {
      method: "POST",
      headers: {
        authorization: "Bearer service-token",
      },
    });

    const response = await route.POST(request as unknown as RefreshRequest);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(mockRefreshLatestExchangeRates).toHaveBeenCalledTimes(1);
    expect(payload.refreshed).toBe(true);
  });
});
