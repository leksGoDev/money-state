import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    session: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import {
  getRequestSessionToken,
  getServerUserId,
  requireRequestUserId,
  SESSION_COOKIE_NAME,
  setSessionCookie,
} from "@/lib/auth/session";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

function createRequest(params: { sessionToken?: string }) {
  return {
    cookies: {
      get: (name: string) =>
        name === SESSION_COOKIE_NAME && params.sessionToken
          ? { value: params.sessionToken }
          : undefined,
    },
  };
}

describe("session request helpers", () => {
  it("extracts session token from request cookie", () => {
    const request = createRequest({ sessionToken: "session_t" });
    expect(getRequestSessionToken(request)).toBe("session_t");
  });

  it("returns null when session cookie is missing", () => {
    const request = createRequest({});
    expect(getRequestSessionToken(request)).toBeNull();
  });

  it("throws unauthorized when session token is missing", async () => {
    const request = createRequest({});
    await expect(requireRequestUserId(request)).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHORIZED",
    });
  });

  it("resolves user id from valid persisted session token", async () => {
    vi.mocked(prisma.session.findFirst).mockResolvedValueOnce({
      userId: "user_1",
    } as never);

    const request = createRequest({ sessionToken: "session_t" });
    await expect(requireRequestUserId(request)).resolves.toBe("user_1");
  });

  it("throws unauthorized when persisted session is missing", async () => {
    vi.mocked(prisma.session.findFirst).mockResolvedValueOnce(null);

    const request = createRequest({ sessionToken: "session_t" });
    await expect(requireRequestUserId(request)).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHORIZED",
    });
  });

  it("prefers auth() user in server scope", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: {
        id: "auth_user",
      },
    } as never);

    await expect(getServerUserId()).resolves.toBe("auth_user");
  });

  it("resolves server user id from persisted session when auth is empty", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);
    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi.fn(() => ({ value: "session_t" })),
    } as never);
    vi.mocked(prisma.session.findFirst).mockResolvedValueOnce({
      userId: "cookie_user",
    } as never);

    await expect(getServerUserId()).resolves.toBe("cookie_user");
  });

  it("stores opaque session token in cookie and persists session", async () => {
    const setCookie = vi.fn();
    const response = {
      cookies: {
        set: setCookie,
      },
    } as never;

    vi.mocked(prisma.session.create).mockResolvedValueOnce({} as never);

    await setSessionCookie(response, "user_1");

    expect(prisma.session.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user_1",
          sessionToken: expect.any(String),
          expires: expect.any(Date),
        }),
      }),
    );
    expect(setCookie).toHaveBeenCalledWith(
      SESSION_COOKIE_NAME,
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
      }),
    );
  });
});
