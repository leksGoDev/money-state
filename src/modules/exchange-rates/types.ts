import type { Currency } from "@/domain/types/money";

export type RatesMap = Map<string, number>;

export type ConversionContext = {
  baseCurrency: Currency;
  ratesDate: string | null;
  approximate: boolean;
  rates: RatesMap;
};

export type FrankfurterLatestResponse = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};
