import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import { getSettings, updateSettings } from "@/modules/settings";

export async function GET(request: NextRequest) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const settings = await getSettings(userId);
    return ok(settings);
  });
}

export async function PATCH(request: NextRequest) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const payload = await request.json();
    const settings = await updateSettings(userId, payload);
    return ok(settings);
  });
}
