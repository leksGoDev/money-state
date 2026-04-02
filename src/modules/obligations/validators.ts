import {
  cancelObligationSchema,
  listObligationsQuerySchema,
  obligationCreateSchema,
  resolveObligationSchema,
} from "@/modules/obligations/schemas";

export function parseObligationInput(input: unknown) {
  return obligationCreateSchema.parse(input);
}

export function parseListObligationsQuery(input: unknown) {
  return listObligationsQuerySchema.parse(input);
}

export function parseResolveObligationPayload(input: unknown) {
  return resolveObligationSchema.parse(input);
}

export function parseCancelObligationPayload(input: unknown) {
  return cancelObligationSchema.parse(input);
}
