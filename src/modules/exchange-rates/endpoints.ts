import {
  frankfurterBaseUrl,
  frankfurterLatestPath,
  ratesSourceBaseCurrency,
  supportedCurrencies,
} from "@/modules/exchange-rates/constants";

export function buildFrankfurterLatestUrl(): string {
  const url = new URL(frankfurterLatestPath, frankfurterBaseUrl);
  url.searchParams.set("from", ratesSourceBaseCurrency);
  url.searchParams.set("to", supportedCurrencies.join(","));
  return url.toString();
}
