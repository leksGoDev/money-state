import type { NextRequest } from "next/server";

import { handleApi } from "@/lib/api/server/handler";
import { ok } from "@/lib/api/server/response";
import { requireRequestUserId } from "@/lib/auth/session";
import { searchParamsToObject } from "@/lib/http/url";
import { createIncome, listIncomes } from "@/modules/confirmed/income";

export async function GET(request: NextRequest) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const query = searchParamsToObject(request.nextUrl.searchParams);
    const incomes = await listIncomes(userId, query);
    return ok(incomes);
  });
}

export async function POST(request: NextRequest) {
  return handleApi(async () => {
    const userId = requireRequestUserId(request);
    const payload = await request.json();
    const created = await createIncome(userId, payload);
    return ok(created, 201);
  });
}
