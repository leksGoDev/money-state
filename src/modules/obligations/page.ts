import { isOverdueObligation, periodFromParts } from "@/domain";
import { toPageLoadErrorMessage } from "@/lib/api/client/load-error";
import { getCurrentYearMonth } from "@/lib/date/period";
import { listObligations } from "@/modules/obligations";
import type { ObligationDto } from "@/modules/obligations/types";

type ObligationsPageData = {
  obligations: ObligationDto[];
  loadError: string | null;
};

function toOverdueComparable(entry: ObligationDto) {
  return {
    id: entry.id,
    title: entry.title,
    amount: Number(entry.convertedAmount ?? entry.amount),
    direction: entry.direction,
    status: entry.status,
    activeFromYear: entry.activeFromYear,
    activeFromMonth: periodFromParts(entry.activeFromYear, entry.activeFromMonth).month,
    expectedYear: entry.expectedYear,
    expectedMonth:
      entry.expectedYear != null && entry.expectedMonth != null
        ? periodFromParts(entry.expectedYear, entry.expectedMonth).month
        : null,
    resolvedYear: entry.resolvedYear,
    resolvedMonth:
      entry.resolvedYear != null && entry.resolvedMonth != null
        ? periodFromParts(entry.resolvedYear, entry.resolvedMonth).month
        : null,
  };
}

export async function loadObligationsPageData(
  userId: string,
): Promise<ObligationsPageData> {
  try {
    return {
      obligations: await listObligations(userId, {}),
      loadError: null,
    };
  } catch (error) {
    console.error("Failed to load obligations page data.", error);
    return {
      obligations: [],
      loadError: toPageLoadErrorMessage(
        error,
        "Unable to load obligations. Check database connection.",
      ),
    };
  }
}

export function buildOverdueObligationIdSet(
  obligations: ReadonlyArray<ObligationDto>,
): Set<string> {
  const current = getCurrentYearMonth();
  const selectedPeriod = periodFromParts(current.year, current.month);

  return new Set(
    obligations
      .filter((item) =>
        isOverdueObligation(toOverdueComparable(item), selectedPeriod),
      )
      .map((item) => item.id),
  );
}
