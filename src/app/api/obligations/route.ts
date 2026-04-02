import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import { searchParamsToObject } from "@/lib/http/url";
import {
  createObligation,
  listObligations,
} from "@/modules/obligations";

export async function GET(request: NextRequest) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const query = searchParamsToObject(request.nextUrl.searchParams);
    const obligations = await listObligations(userId, query);
    return ok(obligations);
  });
}

export async function POST(request: NextRequest) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const payload = await request.json();
    const created = await createObligation(userId, payload);
    return ok(created, 201);
  });
}
