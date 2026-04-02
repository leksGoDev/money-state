import { monthViewQuerySchema, yearViewQuerySchema } from "@/modules/views/schemas";

export function parseMonthViewQuery(input: unknown) {
  return monthViewQuerySchema.parse(input);
}

export function parseYearViewQuery(input: unknown) {
  return yearViewQuerySchema.parse(input);
}
