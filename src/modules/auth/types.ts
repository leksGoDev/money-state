import type { Account as PrismaAccount } from "@prisma/client";
import type { Currency } from "@/domain/types/money";

export type UserProfileDto = {
  id: string;
  email: string;
  name: string | null;
  baseCurrency: Currency;
  providers: string[];
};

export type AuthUserIdentity = {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string | null;
};

export type GoogleOauthTokens = Partial<
  Pick<
    PrismaAccount,
    | "refresh_token"
    | "access_token"
    | "expires_at"
    | "token_type"
    | "scope"
    | "id_token"
    | "session_state"
  >
>;

export type ResolveGoogleAccountUserIdParams = {
  email: string;
  name: string | null;
  emailVerified: boolean;
  providerAccountId: string;
  accountType: string;
  oauthTokens: GoogleOauthTokens;
};

export type AuthorizedIdentity = {
  id: string;
  email: string;
  name: string | null;
};

export type ResolveGoogleSignInInput = {
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  providerAccountId: string | undefined;
  accountType: string;
  oauthTokens: {
    refresh_token: string | null | undefined;
    access_token: string | null | undefined;
    expires_at: number | null | undefined;
    token_type: string | null | undefined;
    scope: string | null | undefined;
    id_token: string | null | undefined;
    session_state: string | null | undefined;
  };
};

export type ResolveGoogleSignInResult = {
  userId: string;
  email: string;
};
