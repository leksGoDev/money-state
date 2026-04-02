import { moneyToString } from "@/domain/types/money";

export function formatMoneyValue(value: number): string {
  return moneyToString(value);
}

export function formatMonthLabel(year: number, month: number): string {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}
