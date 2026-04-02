import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { ApiError } from "@/lib/api/server/errors";
vi.mock("@/lib/auth/session", () => ({
  setSessionCookie: vi.fn(),
}));

vi.mock("@/modules/auth", () => ({
  registerUser: vi.fn(),
}));

import * as route from "@/app/api/auth/register/route";
import { setSessionCookie } from "@/lib/auth/session";
import { registerUser } from "@/modules/auth";

const mockSetSessionCookie = vi.mocked(setSessionCookie);
const mockRegisterUser = vi.mocked(registerUser);

describe("/api/auth/register route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 201 and sets session cookie after registration", async () => {
    type RegisterUserResult = Awaited<ReturnType<typeof registerUser>>;
    mockRegisterUser.mockResolvedValue(
      { id: "user_1", email: "u@example.com" } as unknown as RegisterUserResult,
    );

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "u@example.com", password: "secret" }),
    });

    const response = await route.POST(request);

    expect(response.status).toBe(201);
    expect(mockRegisterUser).toHaveBeenCalledWith({
      email: "u@example.com",
      password: "secret",
    });
    expect(mockSetSessionCookie).toHaveBeenCalledWith(response, "user_1");
  });

  it("returns 400 when payload validation fails", async () => {
    mockRegisterUser.mockRejectedValue(new ZodError([]));

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "bad-email" }),
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error.code).toBe("VALIDATION_ERROR");
    expect(mockSetSessionCookie).not.toHaveBeenCalled();
  });

  it("returns 409 when user already exists", async () => {
    mockRegisterUser.mockRejectedValue(
      new ApiError({
        status: 409,
        code: "CONFLICT",
        message: "Email is already registered.",
      }),
    );

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "u@example.com", password: "secret" }),
    });

    const response = await route.POST(request);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.error.code).toBe("CONFLICT");
    expect(mockSetSessionCookie).not.toHaveBeenCalled();
  });
});
