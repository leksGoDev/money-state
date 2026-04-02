export type SearchParamValue = string | string[] | undefined;
export type SearchParamsRecord = Record<string, SearchParamValue>;

export function readSearchParamValue(value: SearchParamValue): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export function parseIntegerParam(
  value: string | null,
  fallback: number,
  options?: {
    min?: number;
    max?: number;
  },
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  if (options?.min != null && parsed < options.min) {
    return fallback;
  }

  if (options?.max != null && parsed > options.max) {
    return fallback;
  }

  return parsed;
}

export function parseStringParam(
  value: string | null,
  fallback: string,
): string {
  return value?.trim() ? value : fallback;
}
