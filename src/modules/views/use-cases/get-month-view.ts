import { getUserCurrencyContext } from "@/modules/shared/currency-context";
import { parseMonthViewQuery } from "@/modules/views/validators";
import { loadViewRows } from "@/modules/views/repository";
import {
  buildConfirmedEntries,
  buildMonthViewDto,
  buildObligationEntries,
} from "@/modules/views/mappers";

export async function getMonthView(userId: string, queryInput: unknown) {
  const query = parseMonthViewQuery(queryInput);
  const [rows, currencyContext] = await Promise.all([
    loadViewRows(userId),
    getUserCurrencyContext(userId),
  ]);

  const confirmedEntries = buildConfirmedEntries({
    incomes: rows.incomes,
    expenses: rows.expenses,
    fallbackYear: query.year,
    fallbackMonth: query.month,
    conversionContext: currencyContext.conversion,
  });

  const obligationEntries = buildObligationEntries(
    rows.obligations,
    currencyContext.conversion,
  );

  return buildMonthViewDto({
    year: query.year,
    month: query.month,
    expectedWindow: query.expectedWindow,
    confirmedEntries,
    obligationEntries,
    obligationRows: rows.obligations,
    currencyContext,
  });
}
