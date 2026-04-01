import { findExpenses } from "@/modules/expenses/repository";
import {
  buildExpensesWhereClause,
  filterExpensesByActivePeriod,
  mapExpenseRowsToDto,
} from "@/modules/expenses/mappers";
import { parseListExpensesQuery } from "@/modules/expenses/schemas";

export async function listExpenses(userId: string, queryInput: unknown) {
  const query = parseListExpensesQuery(queryInput);
  const rows = await findExpenses(buildExpensesWhereClause(userId, query));
  const filtered = filterExpensesByActivePeriod(rows, query);
  return mapExpenseRowsToDto(userId, filtered);
}
