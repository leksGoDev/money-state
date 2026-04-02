import { beforeEach, describe, expect, it, vi } from "vitest";

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
});
