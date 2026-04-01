import type { Expense } from "@prisma/client";
import type { z } from "zod";

import type { ConfirmedListItemDto } from "@/modules/shared/confirmed";
import type { listExpensesQuerySchema } from "@/modules/expenses/schemas";

export type ListExpensesQuery = z.infer<typeof listExpensesQuerySchema>;
export type ExpenseRow = Expense;
export type ExpenseDto = ConfirmedListItemDto;
