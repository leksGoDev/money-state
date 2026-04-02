import { ObligationStatus } from "@prisma/client";

import { badRequest, notFound } from "@/lib/api/server/errors";
import {
  createExpenseFromObligation,
  createIncomeFromObligation,
  findObligationForResolve,
  resolveObligationStatus,
  withObligationsTransaction,
} from "@/modules/obligations/repository";
import { mapObligationRowsToDto } from "@/modules/obligations/mappers";
import { parseResolveObligationPayload } from "@/modules/obligations/validators";

export async function resolveObligation(
  userId: string,
  obligationId: string,
  payload: unknown,
) {
  const input = parseResolveObligationPayload(payload);

  return withObligationsTransaction(async (tx) => {
    const obligation = await findObligationForResolve(tx, userId, obligationId);

    if (!obligation) {
      notFound("Obligation not found.");
    }

    if (obligation.status !== ObligationStatus.ACTIVE) {
      badRequest("Only active obligations can be resolved.");
    }

    const updatedObligation = await resolveObligationStatus(tx, obligationId, {
      status: ObligationStatus.DONE,
      resolvedYear: input.resolvedYear,
      resolvedMonth: input.resolvedMonth,
    });

    if (input.resolution === "closed") {
      const [dto] = await mapObligationRowsToDto(userId, [updatedObligation]);
      return {
        obligation: dto,
        conversion: null,
      };
    }

    if (obligation.incomeConversion || obligation.expenseConversion) {
      badRequest("Obligation is already converted.");
    }

    const conversionTitle = input.confirmed.title ?? obligation.title;
    const conversionNotes = input.confirmed.notes ?? obligation.notes;
    const conversionCategoryId = input.confirmed.categoryId ?? obligation.categoryId;

    if (obligation.direction === "RECEIVE") {
      const income = await createIncomeFromObligation(tx, {
        userId,
        obligationId: obligation.id,
        title: conversionTitle,
        notes: conversionNotes,
        categoryId: conversionCategoryId,
        amount: obligation.amount,
        currency: obligation.currency,
        resolvedYear: input.resolvedYear,
        resolvedMonth: input.resolvedMonth,
      });

      const [dto] = await mapObligationRowsToDto(userId, [updatedObligation]);
      return {
        obligation: dto,
        conversion: {
          entityType: "income" as const,
          id: income.id,
        },
      };
    }

    const expense = await createExpenseFromObligation(tx, {
      userId,
      obligationId: obligation.id,
      title: conversionTitle,
      notes: conversionNotes,
      categoryId: conversionCategoryId,
      amount: obligation.amount,
      currency: obligation.currency,
      resolvedYear: input.resolvedYear,
      resolvedMonth: input.resolvedMonth,
    });

    const [dto] = await mapObligationRowsToDto(userId, [updatedObligation]);
    return {
      obligation: dto,
      conversion: {
        entityType: "expense" as const,
        id: expense.id,
      },
    };
  });
}
