import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/modules/auth", () => ({
  getCurrentUserProfile: vi.fn(),
}));

import { auth } from "@/auth";

type MockAuthSession = { user?: { id?: string } } | null;
const mockAuth = vi.mocked(
  auth as unknown as () => Promise<MockAuthSession>,
);
import * as route from "@/app/api/me/route";
import { getCurrentUserProfile } from "@/modules/auth";

type MeRequest = Parameters<typeof route.GET>[0];
type UserProfileResult = Awaited<ReturnType<typeof getCurrentUserProfile>>;

const mockGetCurrentUserProfile = vi.mocked(getCurrentUserProfile);

describe("/api/me route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
  });

  it("returns current user profile for request user", async () => {
    mockGetCurrentUserProfile.mockResolvedValue(
      { id: "user_1", email: "user@example.com" } as unknown as UserProfileResult,
    );

    const response = await route.GET(
      {
        cookies: { get: vi.fn(() => ({ value: "user_1" })) },
        headers: { get: vi.fn() },
      } as unknown as MeRequest,
    );

    expect(response.status).toBe(200);
    expect(mockGetCurrentUserProfile).toHaveBeenCalledWith("user_1");
  });
});
