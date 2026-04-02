import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import { searchParamsToObject } from "@/lib/http/url";
import { getYearView } from "@/modules/views";

export async function GET(request: NextRequest) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const query = searchParamsToObject(request.nextUrl.searchParams);
    const view = await getYearView(userId, query);
    return ok(view);
  });
}
