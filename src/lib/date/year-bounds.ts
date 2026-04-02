export const YEAR_SUPPORTED_WINDOW = 100;

export function getMinSupportedYear(now = new Date()): number {
  return now.getFullYear() - YEAR_SUPPORTED_WINDOW;
}

export function getMaxSupportedYear(now = new Date()): number {
  return now.getFullYear() + YEAR_SUPPORTED_WINDOW;
}
