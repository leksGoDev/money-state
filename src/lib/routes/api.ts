export const apiPaths = {
  register: "/api/auth/register",
  me: "/api/me",
  settings: "/api/settings",
  incomes: "/api/incomes",
  expenses: "/api/expenses",
  obligations: "/api/obligations",
  categories: "/api/categories",
  viewsMonth: "/api/views/month",
  viewsYear: "/api/views/year",
  exchangeRatesRefresh: "/api/exchange-rates/refresh",
} as const;

export type ConfirmedApiCollection = "incomes" | "expenses";

export function confirmedItemApiPath(params: {
  collection: ConfirmedApiCollection;
  id: string;
}): string {
  return `/api/${params.collection}/${params.id}`;
}

export function obligationResolveApiPath(obligationId: string): string {
  return `/api/obligations/${obligationId}/resolve`;
}

export function obligationCancelApiPath(obligationId: string): string {
  return `/api/obligations/${obligationId}/cancel`;
}
