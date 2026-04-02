import type { Currency } from "@/domain/types/money";

export type UserProfileDto = {
  id: string;
  email: string;
  name: string | null;
  baseCurrency: Currency;
  providers: string[];
};
