import type { Currency as PrismaCurrency } from "@prisma/client";

import { fromPrismaCurrency } from "@/modules/shared/repository-enums";
import type { UserProfileDto } from "@/modules/auth/types";

type UserWithAccounts = {
  id: string;
  email: string;
  name: string | null;
  baseCurrency: PrismaCurrency;
  passwordHash: string | null;
  accounts: Array<{ provider: string }>;
};

export function toUserProfileDto(user: UserWithAccounts): UserProfileDto {
  const providers = new Set<string>();

  if (user.passwordHash) {
    providers.add("credentials");
  }

  for (const account of user.accounts) {
    providers.add(account.provider);
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    baseCurrency: fromPrismaCurrency(user.baseCurrency),
    providers: Array.from(providers),
  };
}
