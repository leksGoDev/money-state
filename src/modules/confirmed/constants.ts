import type { ConfirmedEndpoint } from "@/modules/confirmed/shared";
import { apiPaths } from "@/lib/routes/api";

export const itemsTabValues = ["incomes", "expenses"] as const;
export type ItemsTab = (typeof itemsTabValues)[number];

export const itemsTabLabels: Record<ItemsTab, string> = {
  incomes: "Incomes",
  expenses: "Expenses",
};

export const itemsCreateConfig: Record<
  ItemsTab,
  { endpoint: ConfirmedEndpoint; label: string }
> = {
  incomes: {
    endpoint: apiPaths.incomes,
    label: "Income",
  },
  expenses: {
    endpoint: apiPaths.expenses,
    label: "Expense",
  },
};
