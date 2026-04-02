import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import { resolveObligation } from "@/modules/obligations";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const params = await context.params;
    const payload = await request.json();
    const result = await resolveObligation(userId, params.id, payload);
    return ok(result);
  });
}
