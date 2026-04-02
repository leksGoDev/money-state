import {
  parseStringParam,
  readSearchParamValue,
  type SearchParamsRecord,
} from "@/lib/http/query";
import {
  itemsCreateConfig,
  itemsTabValues,
  type ItemsTab,
} from "@/modules/confirmed/constants";
import { listExpenses } from "@/modules/confirmed/expense";
import { listIncomes } from "@/modules/confirmed/income";
import type { ConfirmedListItemDto } from "@/modules/confirmed/shared";

export type ItemsPageData = {
  incomes: ConfirmedListItemDto[];
  expenses: ConfirmedListItemDto[];
  loadError: string | null;
};

function isItemsTab(value: string): value is ItemsTab {
  return (itemsTabValues as readonly string[]).includes(value);
}

export function parseItemsTab(searchParams: SearchParamsRecord): ItemsTab {
  const fallback = itemsTabValues[0];
  const tab = parseStringParam(readSearchParamValue(searchParams.tab), fallback);
  return isItemsTab(tab) ? tab : fallback;
}

export async function loadItemsPageData(userId: string): Promise<ItemsPageData> {
  try {
    const [incomes, expenses] = await Promise.all([
      listIncomes(userId, {}),
      listExpenses(userId, {}),
    ]);

    return {
      incomes,
      expenses,
      loadError: null,
    };
  } catch {
    return {
      incomes: [],
      expenses: [],
      loadError: "Unable to load items. Check database connection.",
    };
  }
}

export function getConfirmedCreateConfig(tab: ItemsTab) {
  return itemsCreateConfig[tab];
}

export function getItemsRowsByTab(
  tab: ItemsTab,
  data: ItemsPageData,
): ConfirmedListItemDto[] {
  return tab === "incomes" ? data.incomes : data.expenses;
}
