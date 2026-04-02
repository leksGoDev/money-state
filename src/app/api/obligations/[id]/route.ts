import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import {
  deleteObligation,
  getObligationById,
  updateObligation,
} from "@/modules/obligations";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const params = await context.params;
    const obligation = await getObligationById(userId, params.id);
    return ok(obligation);
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const params = await context.params;
    const payload = await request.json();
    const obligation = await updateObligation(userId, params.id, payload);
    return ok(obligation);
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const params = await context.params;
    const result = await deleteObligation(userId, params.id);
    return ok(result);
  });
}
