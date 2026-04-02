import {
  Currency as PrismaCurrency,
  ObligationDirection as PrismaObligationDirection,
  ObligationStatus as PrismaObligationStatus,
  TimingType as PrismaTimingType,
} from "@prisma/client";

import type { ConfirmedTimingType } from "@/domain/types/confirmed";
import type { Currency } from "@/domain/types/money";
import type {
  ObligationDirection,
  ObligationStatus,
} from "@/domain/types/obligation";

export function toPrismaCurrency(currency: Currency): PrismaCurrency {
  return PrismaCurrency[currency];
}

export function fromPrismaCurrency(currency: PrismaCurrency): Currency {
  return currency;
}

export function toPrismaTimingType(
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

export function fromPrismaTimingType(
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

export function toPrismaObligationDirection(
  direction: ObligationDirection,
): PrismaObligationDirection {
  if (direction === "pay") {
    return PrismaObligationDirection.PAY;
  }

  return PrismaObligationDirection.RECEIVE;
}

export function fromPrismaObligationDirection(
  direction: PrismaObligationDirection,
): ObligationDirection {
  if (direction === PrismaObligationDirection.PAY) {
    return "pay";
  }

  return "receive";
}

export function toPrismaObligationStatus(
  status: ObligationStatus,
): PrismaObligationStatus {
  if (status === "active") {
    return PrismaObligationStatus.ACTIVE;
  }

  if (status === "done") {
    return PrismaObligationStatus.DONE;
  }

  return PrismaObligationStatus.CANCELED;
}

export function fromPrismaObligationStatus(
  status: PrismaObligationStatus,
): ObligationStatus {
  if (status === PrismaObligationStatus.ACTIVE) {
    return "active";
  }

  if (status === PrismaObligationStatus.DONE) {
    return "done";
  }

  return "canceled";
}
