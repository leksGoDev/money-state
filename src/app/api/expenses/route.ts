import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { requireRequestUserId } from "@/lib/auth/session";
import { searchParamsToObject } from "@/lib/http/url";
import { createExpense, listExpenses } from "@/modules/expenses";

export async function GET(request: NextRequest) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const query = searchParamsToObject(request.nextUrl.searchParams);
    const expenses = await listExpenses(userId, query);
    return ok(expenses);
  });
}

export async function POST(request: NextRequest) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const payload = await request.json();
    const created = await createExpense(userId, payload);
    return ok(created, 201);
  });
}
