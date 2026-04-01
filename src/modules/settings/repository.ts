import type { Currency as PrismaCurrency } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function findUserSettingsRow(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, baseCurrency: true },
  });
}

export async function updateUserBaseCurrencyRow(
  userId: string,
  baseCurrency: PrismaCurrency,
) {
  return prisma.user.update({
    where: { id: userId },
    data: { baseCurrency },
    select: { baseCurrency: true },
  });
}
