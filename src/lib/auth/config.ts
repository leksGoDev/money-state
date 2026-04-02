import type { NextAuthConfig } from "next-auth";

// Foundation config for Auth.js integration.
// Providers and adapters can be added incrementally without changing business routes.
export const authConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
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
