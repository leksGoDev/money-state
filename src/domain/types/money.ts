export const currencyValues = ["USD", "EUR", "RUB", "CNY"] as const;

export type Currency = (typeof currencyValues)[number];

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function moneyToString(value: number): string {
  return roundMoney(value).toFixed(2);
}
