import { currencyValues, type Currency } from "@/domain/types/money";

export const ratesSourceBaseCurrency: Currency = "EUR";
export const supportedCurrencies: readonly Currency[] = currencyValues;

export const frankfurterBaseUrl = "https://api.frankfurter.app";
export const frankfurterLatestPath = "/latest";
