export const appPaths = {
  home: "/",
  items: "/items",
  obligations: "/obligations",
  settings: "/settings",
} as const;

function withQuery(
  path: string,
  query: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value == null) {
      continue;
    }

    params.set(key, String(value));
  }

  const serialized = params.toString();
  return serialized.length > 0 ? `${path}?${serialized}` : path;
}

export function homeMonthRoute(params: { year: number; month: number }): string {
  return withQuery(appPaths.home, {
    mode: "month",
    year: params.year,
    month: params.month,
  });
}

export function homeYearRoute(params: { year: number }): string {
  return withQuery(appPaths.home, {
    mode: "year",
    year: params.year,
  });
}

export function itemsTabRoute(tab: string): string {
  return withQuery(appPaths.items, { tab });
}
