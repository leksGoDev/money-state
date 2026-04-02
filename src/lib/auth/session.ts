import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/api/server/errors";

export const SESSION_COOKIE_NAME = "money_state_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type RequestWithSessionCookie = {
  cookies: {
    get(name: string): { value: string } | undefined;
  };
};

export function getRequestSessionToken(request: RequestWithSessionCookie): string | null {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
}

function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

async function findSessionUserId(sessionToken: string): Promise<string | null> {
  const session = await prisma.session.findFirst({
    where: {
      sessionToken,
      expires: {
        gt: new Date(),
      },
    },
    select: {
      userId: true,
    },
  });

  return session?.userId ?? null;
export async function requireRequestUserId(
  request: RequestWithSessionCookie,
): Promise<string> {
  const sessionToken = getRequestSessionToken(request);

  if (!sessionToken) {
    unauthorized();
  }

  const userId = await findSessionUserId(sessionToken);

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
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  return findSessionUserId(sessionToken);
}

export async function setSessionCookie(
  response: NextResponse,
  userId: string,
): Promise<void> {
  const sessionToken = createSessionToken();

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
    },
  });

  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}
