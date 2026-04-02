import { Currency as PrismaCurrency, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function findLatestRatesSnapshot() {
  return prisma.exchangeRateSnapshot.findFirst({
    where: {
      baseCurrency: PrismaCurrency.EUR,
    },
    include: {
      rates: true,
    },
    orderBy: {
      ratesDate: "desc",
    },
  });
}

export async function upsertRatesSnapshot(params: {
  ratesDate: Date;
  rates: Array<{
    fromCurrency: PrismaCurrency;
    toCurrency: PrismaCurrency;
    rate: number;
  }>;
}) {
  return prisma.exchangeRateSnapshot.upsert({
    where: {
      baseCurrency_ratesDate: {
        baseCurrency: PrismaCurrency.EUR,
        ratesDate: params.ratesDate,
      },
    },
    create: {
      baseCurrency: PrismaCurrency.EUR,
      ratesDate: params.ratesDate,
      rates: {
        create: params.rates,
      },
    },
    update: {
      fetchedAt: new Date(),
      rates: {
        deleteMany: {},
        create: params.rates,
      },
    },
  });
}
