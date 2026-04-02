import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import {
  getRequestUserId,
  requireRequestUserId,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session";

function createRequest(params: { cookieUserId?: string }) {
  return {
    cookies: {
      get: (name: string) =>
        name === SESSION_COOKIE_NAME && params.cookieUserId
          ? { value: params.cookieUserId }
          : undefined,
    },
  };
}

describe("session request helpers", () => {
  it("extracts user id from session cookie first", () => {
    const request = createRequest({ cookieUserId: "cookie_u" });
    expect(getRequestUserId(request)).toBe("cookie_u");
  });

  it("does not use x-user-id header fallback", () => {
    const request = createRequest({});
    expect(getRequestUserId(request)).toBeNull();
  });

  it("throws unauthorized when user id is missing", () => {
    const request = createRequest({});
    expect(() => requireRequestUserId(request)).toThrowError();

    try {
      requireRequestUserId(request);
    } catch (error) {
      expect(error).toMatchObject({ status: 401, code: "UNAUTHORIZED" });
    }
  });
});
