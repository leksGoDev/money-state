import { listExpensesQuerySchema } from "@/modules/confirmed/expense/schemas";

export function parseListExpensesQuery(input: unknown) {
  return listExpensesQuerySchema.parse(input);
}
