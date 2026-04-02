import { findExpenses } from "@/modules/confirmed/expense/repository";
import {
  buildExpensesWhereClause,
  filterExpensesByActivePeriod,
  mapExpenseRowsToDto,
} from "@/modules/confirmed/expense/mappers";
import { parseListExpensesQuery } from "@/modules/confirmed/expense/validators";

export async function listExpenses(userId: string, queryInput: unknown) {
  const query = parseListExpensesQuery(queryInput);
  const rows = await findExpenses(buildExpensesWhereClause(userId, query));
  const filtered = filterExpensesByActivePeriod(rows, query);
  return mapExpenseRowsToDto(userId, filtered);
}
