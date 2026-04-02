import type { ConfirmedTimingType } from "@/domain/types/confirmed";
import {
  Currency as PrismaCurrency,
  TimingType as PrismaTimingType,
} from "@prisma/client";

import type { Currency } from "@/domain/types/money";

export function toPersistenceCurrency(currency: Currency): PrismaCurrency {
  return PrismaCurrency[currency];
}

export function fromPersistenceCurrency(currency: PrismaCurrency): Currency {
  return currency;
}

export function toPersistenceTimingType(
  timingType: ConfirmedTimingType,
): PrismaTimingType {
  if (timingType === "single") {
    return PrismaTimingType.SINGLE;
  }

  if (timingType === "monthly") {
    return PrismaTimingType.MONTHLY;
  }

  return PrismaTimingType.YEARLY;
}

export function fromPersistenceTimingType(
  timingType: PrismaTimingType,
): ConfirmedTimingType {
  if (timingType === PrismaTimingType.SINGLE) {
    return "single";
  }

  if (timingType === PrismaTimingType.MONTHLY) {
    return "monthly";
  }

  return "yearly";
}
