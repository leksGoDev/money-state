import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authorizeCredentials, resolveGoogleSignIn } from "@/modules/auth";

function buildProviders() {
  const providers: NextAuthConfig["providers"] = [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        return authorizeCredentials(rawCredentials);
      },
    }),
  ];

  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    );
  }

  return providers;
}

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  providers: buildProviders(),
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = typeof profile?.email === "string" ? profile.email : null;
      const resolvedGoogleSignIn = await resolveGoogleSignIn({
        email,
        emailVerified: profile?.email_verified === true,
        name: typeof profile?.name === "string" ? profile.name : null,
        providerAccountId: account.providerAccountId,
        accountType: account.type,
        oauthTokens: {
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state:
            typeof account.session_state === "string"
              ? account.session_state
              : undefined,
        },
      });

      if (!resolvedGoogleSignIn) {
        return false;
      }

      user.id = resolvedGoogleSignIn.userId;
      user.email = resolvedGoogleSignIn.email;
      return true;
    },
    async jwt({ token, user }) {
      if (user && "id" in user && typeof user.id === "string") {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
} satisfies NextAuthConfig;
