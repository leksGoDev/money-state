import { getCurrentYearMonth } from "@/lib/date/period";
import { getMaxSupportedYear, getMinSupportedYear } from "@/lib/date/year-bounds";
import { toPageLoadErrorMessage } from "@/lib/api/client/load-error";
import {
  parseIntegerParam,
  readSearchParamValue,
  type SearchParamsRecord,
} from "@/lib/http/query";
import { homeModeValues, type HomeMode } from "@/modules/views/constants";
import { getMonthView, getYearView } from "@/modules/views";
import type { MonthViewDto, YearViewDto } from "@/modules/views/types";

export type HomePageQuery = {
  mode: HomeMode;
  year: number;
  month: number;
};

export type HomePageData = {
  monthData: MonthViewDto | null;
  yearData: YearViewDto | null;
  loadError: string | null;
};

function isHomeMode(value: string): value is HomeMode {
  return (homeModeValues as readonly string[]).includes(value);
}

export function parseHomePageQuery(searchParams: SearchParamsRecord): HomePageQuery {
  const current = getCurrentYearMonth();
  const minSupportedYear = getMinSupportedYear();
  const maxSupportedYear = getMaxSupportedYear();
  const fallback = homeModeValues[0];
  const rawMode = readSearchParamValue(searchParams.mode) ?? fallback;
  const mode = isHomeMode(rawMode) ? rawMode : fallback;
  const year = parseIntegerParam(readSearchParamValue(searchParams.year), current.year, {
    min: minSupportedYear,
    max: maxSupportedYear,
  });
  const month = parseIntegerParam(readSearchParamValue(searchParams.month), current.month, {
    min: 1,
    max: 12,
  });

  return {
    mode,
    year,
    month,
  };
}

export async function loadHomePageData(
  userId: string,
  query: HomePageQuery,
): Promise<HomePageData> {
  try {
    if (query.mode === "month") {
      return {
        monthData: await getMonthView(userId, {
          year: query.year,
          month: query.month,
          expectedWindow: 1,
        }),
        yearData: null,
        loadError: null,
      };
    }

    return {
      monthData: null,
      yearData: await getYearView(userId, {
        year: query.year,
        expectedWindow: 1,
      }),
      loadError: null,
    };
  } catch (error) {
    console.error("Failed to load home page data.", error);
    return {
      monthData: null,
      yearData: null,
      loadError: toPageLoadErrorMessage(
        error,
        "Unable to load aggregated view. Check database connection and session.",
      ),
    };
  }
}
