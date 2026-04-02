import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { unauthorized } from "@/lib/api/server/errors";

export const SESSION_COOKIE_NAME = "money_state_session";

type RequestWithSessionCookie = {
  cookies: {
    get(name: string): { value: string } | undefined;
  };
};

export function getRequestUserId(request: RequestWithSessionCookie): string | null {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export function requireRequestUserId(request: RequestWithSessionCookie): string {
  const userId = getRequestUserId(request);

  if (!userId) {
    unauthorized();
  }

  return userId;
}

export async function getServerUserId(): Promise<string | null> {
  const session = await auth();
  const authUserId =
    session?.user && "id" in session.user && typeof session.user.id === "string"
      ? session.user.id
      : null;

  if (authUserId) {
    return authUserId;
  }

  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export function setSessionCookie(response: NextResponse, userId: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
