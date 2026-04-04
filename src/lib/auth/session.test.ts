import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/auth";
import { getServerUserId, requireRequestUserId } from "@/lib/auth/session";

describe("session request helpers", () => {
  it("throws unauthorized when request has no auth session", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);

    const request = new Request("http://localhost/api/incomes");
    await expect(requireRequestUserId(request as never)).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHORIZED",
    });
  });

  it("resolves user id from Auth.js request session", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: "user_1" },
    } as never);

    const request = new Request("http://localhost/api/incomes");
    await expect(requireRequestUserId(request as never)).resolves.toBe("user_1");
  });

  it("returns auth() user id in server scope", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: {
        id: "auth_user",
      },
    } as never);

    await expect(getServerUserId()).resolves.toBe("auth_user");
  });

  it("returns null when server auth session is missing", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);

    await expect(getServerUserId()).resolves.toBeNull();
  });
});
