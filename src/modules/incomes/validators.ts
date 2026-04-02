import { listIncomesQuerySchema } from "@/modules/incomes/schemas";

export function parseListIncomesQuery(input: unknown) {
  return listIncomesQuerySchema.parse(input);
}
