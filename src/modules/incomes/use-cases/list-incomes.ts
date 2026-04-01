import { findIncomes } from "@/modules/incomes/repository";
import {
  buildIncomesWhereClause,
  filterIncomesByActivePeriod,
  mapIncomeRowsToDto,
} from "@/modules/incomes/mappers";
import { parseListIncomesQuery } from "@/modules/incomes/schemas";

export async function listIncomes(userId: string, queryInput: unknown) {
  const query = parseListIncomesQuery(queryInput);
  const rows = await findIncomes(buildIncomesWhereClause(userId, query));
  const filtered = filterIncomesByActivePeriod(rows, query);
  return mapIncomeRowsToDto(userId, filtered);
}
