import type {
  ResolveGoogleSignInInput,
  ResolveGoogleSignInResult,
} from "@/modules/auth/types";
import { resolveGoogleAccountUserId } from "@/modules/auth/repository";

export async function resolveGoogleSignIn(
  input: ResolveGoogleSignInInput,
): Promise<ResolveGoogleSignInResult | null> {
  if (!input.email || !input.emailVerified || !input.providerAccountId) {
    return null;
  }

  const userId = await resolveGoogleAccountUserId({
    email: input.email,
    emailVerified: input.emailVerified,
    name: input.name,
    providerAccountId: input.providerAccountId,
    accountType: input.accountType,
    oauthTokens: input.oauthTokens,
  });

  if (!userId) {
    return null;
  }

  return {
    userId,
    email: input.email,
  };
}
