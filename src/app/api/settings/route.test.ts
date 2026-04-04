import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/modules/settings", () => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));

import { auth } from "@/auth";

type MockAuthSession = { user?: { id?: string } } | null;
const mockAuth = vi.mocked(
  auth as unknown as () => Promise<MockAuthSession>,
);
import * as route from "@/app/api/settings/route";
import { getSettings, updateSettings } from "@/modules/settings";

type SettingsRequest = Parameters<typeof route.GET>[0];
type GetSettingsResult = Awaited<ReturnType<typeof getSettings>>;
type UpdateSettingsResult = Awaited<ReturnType<typeof updateSettings>>;

const mockGetSettings = vi.mocked(getSettings);
const mockUpdateSettings = vi.mocked(updateSettings);

describe("/api/settings route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
  });

  it("GET returns settings for request user", async () => {
    mockGetSettings.mockResolvedValue(
      { defaultCurrency: "USD" } as unknown as GetSettingsResult,
    );

    const response = await route.GET(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as SettingsRequest,
    );

    expect(response.status).toBe(200);
    expect(mockGetSettings).toHaveBeenCalledWith("user_1");
  });

  it("PATCH forwards payload and userId", async () => {
    mockUpdateSettings.mockResolvedValue(
      { defaultCurrency: "EUR" } as unknown as UpdateSettingsResult,
    );

    const response = await route.PATCH(
      {
        json: vi.fn(async () => ({ defaultCurrency: "EUR" })),
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as SettingsRequest,
    );

    expect(response.status).toBe(200);
    expect(mockUpdateSettings).toHaveBeenCalledWith("user_1", {
      defaultCurrency: "EUR",
    });
  });
});
