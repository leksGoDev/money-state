import type { Income } from "@prisma/client";
import type { z } from "zod";

import type { ConfirmedListItemDto } from "@/modules/shared/confirmed";
import type { listIncomesQuerySchema } from "@/modules/incomes/schemas";

export type ListIncomesQuery = z.infer<typeof listIncomesQuerySchema>;
export type IncomeRow = Income;
export type IncomeDto = ConfirmedListItemDto;
