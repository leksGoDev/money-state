import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import { searchParamsToObject } from "@/lib/http/url";
import { createExpense, listExpenses } from "@/modules/confirmed/expense";

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
