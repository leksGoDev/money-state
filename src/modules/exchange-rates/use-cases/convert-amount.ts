import type { Currency } from "@/domain/types/money";
import { roundMoney } from "@/domain/types/money";
import type { ConversionContext } from "@/modules/exchange-rates/types";
import { rateKey } from "@/modules/exchange-rates/mappers";

export function convertAmount(params: {
  amount: number;
  fromCurrency: Currency;
  context: ConversionContext;
}): number | null {
  const { amount, fromCurrency, context } = params;

  if (fromCurrency === context.baseCurrency) {
    return roundMoney(amount);
  }

  const rate = context.rates.get(rateKey(fromCurrency, context.baseCurrency));

  if (!rate) {
    return null;
  }

  return roundMoney(amount * rate);
}
