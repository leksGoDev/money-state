import type { z } from "zod";

import type { ConfirmedListItemDto, ConfirmedSharedRow } from "@/modules/confirmed/shared";
import type { listExpensesQuerySchema } from "@/modules/confirmed/expense/schemas";

export type ListExpensesQuery = z.infer<typeof listExpensesQuerySchema>;
export type ExpenseRow = ConfirmedSharedRow;
export type ExpenseDto = ConfirmedListItemDto;
