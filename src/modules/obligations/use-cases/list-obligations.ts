import { findObligations } from "@/modules/obligations/repository";
import {
  buildObligationsWhereClause,
  filterObligationsByActivePeriod,
  mapObligationRowsToDto,
} from "@/modules/obligations/mappers";
import { parseListObligationsQuery } from "@/modules/obligations/validators";

export async function listObligations(userId: string, queryInput: unknown) {
  const query = parseListObligationsQuery(queryInput);
  const rows = await findObligations(buildObligationsWhereClause(userId, query));
  const filtered = filterObligationsByActivePeriod(rows, query);
  return mapObligationRowsToDto(userId, filtered);
}
