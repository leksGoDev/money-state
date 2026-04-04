import { auth } from "@/auth";
import { unauthorized } from "@/lib/api/server/errors";

type SessionLike = {
  user?: {
    id?: string | null;
  };
} | null;

function getSessionUserId(session: SessionLike): string | null {
  return session?.user && "id" in session.user && typeof session.user.id === "string"
    ? session.user.id
    : null;
}

export async function requireRequestUserId(
  _request: Request,
): Promise<string> {
  const session = await auth();
  const userId = getSessionUserId(session);

  if (!userId) {
    unauthorized();
  }

  return userId;
}

export async function getServerUserId(): Promise<string | null> {
  const session = await auth();
  return getSessionUserId(session);
}
