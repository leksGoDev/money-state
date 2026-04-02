import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { getRequestUserId, requireRequestUserId, SESSION_COOKIE_NAME } from "@/lib/auth/session";

function createRequest(params: { cookieUserId?: string; headerUserId?: string }) {
  return {
    cookies: {
      get: (name: string) =>
        name === SESSION_COOKIE_NAME && params.cookieUserId
          ? { value: params.cookieUserId }
          : undefined,
    },
    headers: {
      get: (name: string) => (name === "x-user-id" ? params.headerUserId ?? null : null),
    },
  } as never;
}

describe("session request helpers", () => {
  it("extracts user id from session cookie first", () => {
    const request = createRequest({ cookieUserId: "cookie_u", headerUserId: "header_u" });
    expect(getRequestUserId(request)).toBe("cookie_u");
  });

  it("falls back to x-user-id header", () => {
    const request = createRequest({ headerUserId: "header_u" });
    expect(getRequestUserId(request)).toBe("header_u");
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
