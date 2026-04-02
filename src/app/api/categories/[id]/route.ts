import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/modules/categories";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const params = await context.params;
    const category = await getCategoryById(userId, params.id);
    return ok(category);
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const params = await context.params;
    const payload = await request.json();
    const category = await updateCategory(userId, params.id, payload);
    return ok(category);
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const params = await context.params;
    const result = await deleteCategory(userId, params.id);
    return ok(result);
  });
}
