import type { z } from "zod";

import type { ConfirmedListItemDto, ConfirmedSharedRow } from "@/modules/confirmed/shared";
import type { listIncomesQuerySchema } from "@/modules/confirmed/income/schemas";

export type ListIncomesQuery = z.infer<typeof listIncomesQuerySchema>;
export type IncomeRow = ConfirmedSharedRow;
export type IncomeDto = ConfirmedListItemDto;
