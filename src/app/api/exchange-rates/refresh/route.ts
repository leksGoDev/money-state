import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireServiceAuthorization } from "@/lib/api/server/service-auth";
import { refreshLatestExchangeRates } from "@/modules/exchange-rates";

export async function POST(request: NextRequest) {
  return handleApi(async () => {
    requireServiceAuthorization(request);
    const result = await refreshLatestExchangeRates();
    return ok(result);
  });
}
