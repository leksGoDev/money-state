import type { Expense, Income, Obligation } from "@prisma/client";
import type { z } from "zod";

import type {
  monthViewQuerySchema,
  yearViewQuerySchema,
} from "@/modules/views/schemas";
import type { getMonthView } from "@/modules/views/use-cases/get-month-view";
import type { getYearView } from "@/modules/views/use-cases/get-year-view";

export type MonthViewQuery = z.infer<typeof monthViewQuerySchema>;
export type YearViewQuery = z.infer<typeof yearViewQuerySchema>;
export type MonthViewDto = Awaited<ReturnType<typeof getMonthView>>;
export type YearViewDto = Awaited<ReturnType<typeof getYearView>>;

export type ViewRows = {
  incomes: Income[];
  expenses: Expense[];
  obligations: Obligation[];
};
