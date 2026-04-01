import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { requireRequestUserId } from "@/lib/auth/session";
import { getCurrentUserProfile } from "@/modules/auth";

export async function GET(request: NextRequest) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const data = await getCurrentUserProfile(userId);
    return ok(data);
  });
}
