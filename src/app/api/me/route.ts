import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import { getCurrentUserProfile } from "@/modules/auth";

export async function GET(request: NextRequest) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const data = await getCurrentUserProfile(userId);
    return ok(data);
  });
}
