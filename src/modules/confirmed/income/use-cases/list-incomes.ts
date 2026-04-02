import { findIncomes } from "@/modules/confirmed/income/repository";
import {
  buildIncomesWhereClause,
  filterIncomesByActivePeriod,
  mapIncomeRowsToDto,
} from "@/modules/confirmed/income/mappers";
import { parseListIncomesQuery } from "@/modules/confirmed/income/validators";

export async function listIncomes(userId: string, queryInput: unknown) {
  const query = parseListIncomesQuery(queryInput);
  const rows = await findIncomes(buildIncomesWhereClause(userId, query));
  const filtered = filterIncomesByActivePeriod(rows, query);
  return mapIncomeRowsToDto(userId, filtered);
}
