export const monthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type MonthNumber = (typeof monthNumbers)[number];

export type MonthPeriod = {
  year: number;
  month: MonthNumber;
};
