import {
  isObligationActiveInPeriod,
  isOverdueObligation,
  monthDistance,
} from "@/domain/period/match";
import { periodFromParts } from "@/domain/period/period";
import type { ObligationEntry } from "@/domain/types/obligation";
import type { MonthPeriod } from "@/domain/types/period";

export type ObligationGroups = {
  matched: ObligationEntry[];
  overdue: ObligationEntry[];
  unscheduled: ObligationEntry[];
};

export function groupObligationsForMonth(
  obligations: ReadonlyArray<ObligationEntry>,
  selectedPeriod: MonthPeriod,
  expectedWindow: number,
): ObligationGroups {
  const normalizedWindow = Math.max(0, expectedWindow);
  const groups: ObligationGroups = {
    matched: [],
    overdue: [],
    unscheduled: [],
  };

  for (const obligation of obligations) {
    if (!isObligationActiveInPeriod(obligation, selectedPeriod)) {
      continue;
    }

    if (obligation.expectedYear == null || obligation.expectedMonth == null) {
      groups.unscheduled.push(obligation);
      continue;
    }

    if (isOverdueObligation(obligation, selectedPeriod)) {
      groups.overdue.push(obligation);
      continue;
    }

    const expectedPeriod = periodFromParts(
      obligation.expectedYear,
      obligation.expectedMonth,
    );

    if (monthDistance(expectedPeriod, selectedPeriod) <= normalizedWindow) {
      groups.matched.push(obligation);
    }
  }

  return groups;
}
