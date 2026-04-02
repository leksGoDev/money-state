import { describe, expect, it } from "vitest";
import { vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import * as categoriesCollectionRoute from "@/app/api/categories/route";
import * as categoriesItemRoute from "@/app/api/categories/[id]/route";
import * as expensesCollectionRoute from "@/app/api/expenses/route";
import * as expensesItemRoute from "@/app/api/expenses/[id]/route";
import * as incomesCollectionRoute from "@/app/api/incomes/route";
import * as incomesItemRoute from "@/app/api/incomes/[id]/route";
import * as meRoute from "@/app/api/me/route";
import * as obligationsCollectionRoute from "@/app/api/obligations/route";
import * as obligationsItemRoute from "@/app/api/obligations/[id]/route";
import * as obligationsResolveRoute from "@/app/api/obligations/[id]/resolve/route";
import * as obligationsCancelRoute from "@/app/api/obligations/[id]/cancel/route";
import * as settingsRoute from "@/app/api/settings/route";
import * as monthViewRoute from "@/app/api/views/month/route";
import * as yearViewRoute from "@/app/api/views/year/route";

type UserScopedRequest = Parameters<typeof incomesCollectionRoute.GET>[0];
type ItemContext = Parameters<typeof incomesItemRoute.GET>[1];

function unauthenticatedRequest(): UserScopedRequest {
  return {
    cookies: {
      get: () => undefined,
    },
    headers: {
      get: () => null,
    },
    nextUrl: {
      searchParams: new URLSearchParams(),
    },
    json: async () => ({}),
  } as unknown as UserScopedRequest;
}

const itemContext: ItemContext = {
  params: Promise.resolve({ id: "entity_1" }),
};

describe("api business routes auth guard", () => {
  it("returns 401 for all user-scoped routes without session", async () => {
    const request = unauthenticatedRequest();

    const responses = await Promise.all([
      incomesCollectionRoute.GET(request),
      incomesCollectionRoute.POST(request),
      incomesItemRoute.GET(request, itemContext),
      incomesItemRoute.PATCH(request, itemContext),
      incomesItemRoute.DELETE(request, itemContext),

      expensesCollectionRoute.GET(request),
      expensesCollectionRoute.POST(request),
      expensesItemRoute.GET(request, itemContext),
      expensesItemRoute.PATCH(request, itemContext),
      expensesItemRoute.DELETE(request, itemContext),

      categoriesCollectionRoute.GET(request),
      categoriesCollectionRoute.POST(request),
      categoriesItemRoute.GET(request, itemContext),
      categoriesItemRoute.PATCH(request, itemContext),
      categoriesItemRoute.DELETE(request, itemContext),

      obligationsCollectionRoute.GET(request),
      obligationsCollectionRoute.POST(request),
      obligationsItemRoute.GET(request, itemContext),
      obligationsItemRoute.PATCH(request, itemContext),
      obligationsItemRoute.DELETE(request, itemContext),
      obligationsResolveRoute.POST(request, itemContext),
      obligationsCancelRoute.POST(request, itemContext),

      meRoute.GET(request),
      settingsRoute.GET(request),
      settingsRoute.PATCH(request),
      monthViewRoute.GET(request),
      yearViewRoute.GET(request),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(401);
    }
  });
});
