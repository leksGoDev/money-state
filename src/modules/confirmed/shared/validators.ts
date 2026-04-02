import { confirmedEntityCreateSchema } from "@/modules/confirmed/shared/schemas";
import type { ConfirmedInput } from "@/modules/confirmed/shared/types";

export function parseConfirmedInput(input: unknown): ConfirmedInput {
  return confirmedEntityCreateSchema.parse(input);
}
