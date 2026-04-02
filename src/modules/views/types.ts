import type { Expense, Income, Obligation } from "@prisma/client";
import type { z } from "zod";

import type {
  monthViewQuerySchema,
  yearViewQuerySchema,
} from "@/modules/views/schemas";

export type MonthViewQuery = z.infer<typeof monthViewQuerySchema>;
export type YearViewQuery = z.infer<typeof yearViewQuerySchema>;

export type ViewRows = {
  incomes: Income[];
  expenses: Expense[];
  obligations: Obligation[];
};
