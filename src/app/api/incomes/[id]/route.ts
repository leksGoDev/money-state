import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { requireRequestUserId } from "@/lib/auth/session";
import {
  deleteIncome,
  getIncomeById,
  updateIncome,
} from "@/modules/incomes";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const params = await context.params;
    const income = await getIncomeById(userId, params.id);
    return ok(income);
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const params = await context.params;
    const payload = await request.json();
    const income = await updateIncome(userId, params.id, payload);
    return ok(income);
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const params = await context.params;
    const result = await deleteIncome(userId, params.id);
    return ok(result);
  });
}
