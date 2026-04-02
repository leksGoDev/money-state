import { roundMoney } from "@/domain/types/money";

export type RangeValues = {
  min: number;
  max: number;
};

export function calculateRange(
  net: number,
  possiblePay: number,
  possibleReceive: number,
): RangeValues {
  return {
    min: roundMoney(net - possiblePay),
    max: roundMoney(net + possibleReceive),
  };
}
