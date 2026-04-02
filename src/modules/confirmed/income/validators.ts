import { listIncomesQuerySchema } from "@/modules/confirmed/income/schemas";

export function parseListIncomesQuery(input: unknown) {
  return listIncomesQuerySchema.parse(input);
}
