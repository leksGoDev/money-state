import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import {
  createCategory,
  listCategories,
} from "@/modules/categories";

export async function GET(request: NextRequest) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const categories = await listCategories(userId);
    return ok(categories);
  });
}

export async function POST(request: NextRequest) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const payload = await request.json();
    const created = await createCategory(userId, payload);
    return ok(created, 201);
  });
}
