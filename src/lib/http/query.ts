export function parseIntegerParam(
  value: string | null,
  fallback: number,
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseStringParam(
  value: string | null,
  fallback: string,
): string {
  return value?.trim() ? value : fallback;
}
