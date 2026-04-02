import { getUserCurrencyContext } from "@/modules/shared/currency-context";
import { parseYearViewQuery } from "@/modules/views/validators";
import { loadViewRows } from "@/modules/views/repository";
import {
  buildConfirmedEntries,
  buildObligationEntries,
  buildYearViewDto,
} from "@/modules/views/mappers";

export async function getYearView(userId: string, queryInput: unknown) {
  const query = parseYearViewQuery(queryInput);
  const [rows, currencyContext] = await Promise.all([
    loadViewRows(userId),
    getUserCurrencyContext(userId),
  ]);

  const confirmedEntries = buildConfirmedEntries({
    incomes: rows.incomes,
    expenses: rows.expenses,
    fallbackYear: query.year,
    fallbackMonth: 1,
    conversionContext: currencyContext.conversion,
  });

  const obligationEntries = buildObligationEntries(
    rows.obligations,
    currencyContext.conversion,
  );

  return buildYearViewDto({
    year: query.year,
    expectedWindow: query.expectedWindow,
    confirmedEntries,
    obligationEntries,
    currencyContext,
  });
}
