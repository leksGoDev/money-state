import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import {
  deleteExpense,
  getExpenseById,
  updateExpense,
} from "@/modules/confirmed/expense";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const params = await context.params;
    const expense = await getExpenseById(userId, params.id);
    return ok(expense);
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const params = await context.params;
    const payload = await request.json();
    const expense = await updateExpense(userId, params.id, payload);
    return ok(expense);
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleApi(async () => {
    const userId = await requireRequestUserId(request);
    const params = await context.params;
    const result = await deleteExpense(userId, params.id);
    return ok(result);
  });
}
