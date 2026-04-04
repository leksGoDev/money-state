import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/auth";

type MockAuthSession = { user?: { id?: string } } | null;
const mockAuth = vi.mocked(
  auth as unknown as () => Promise<MockAuthSession>,
);
import { getServerUserId, requireRequestUserId } from "@/lib/auth/session";

describe("session request helpers", () => {
  it("throws unauthorized when request has no auth session", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const request = new Request("http://localhost/api/incomes");
    await expect(requireRequestUserId(request)).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHORIZED",
    });
  });

  it("resolves user id from Auth.js request session", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_1" },
    });

    const request = new Request("http://localhost/api/incomes");
    await expect(requireRequestUserId(request)).resolves.toBe("user_1");
  });

  it("returns auth() user id in server scope", async () => {
    mockAuth.mockResolvedValueOnce({
      user: {
        id: "auth_user",
      },
    });

    await expect(getServerUserId()).resolves.toBe("auth_user");
  });

  it("returns null when server auth session is missing", async () => {
    mockAuth.mockResolvedValueOnce(null);

    await expect(getServerUserId()).resolves.toBeNull();
  });
});
