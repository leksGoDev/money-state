import type { Currency } from "@/domain/types/money";
import { notFound } from "@/lib/api/server/errors";
import { prisma } from "@/lib/prisma";
import { getConversionContext, type ConversionContext } from "@/modules/exchange-rates";
import { fromPrismaCurrency } from "@/modules/shared/repository-enums";

export async function getUserCurrencyContext(userId: string): Promise<{
  baseCurrency: Currency;
  conversion: ConversionContext;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, baseCurrency: true },
  });

  if (!user) {
    notFound("User not found.");
  }

  const baseCurrency = fromPrismaCurrency(user.baseCurrency);
  const conversion = await getConversionContext(baseCurrency);

  return { baseCurrency, conversion };
}
