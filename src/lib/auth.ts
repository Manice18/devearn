import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { Adapter } from "next-auth/adapters";
import { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "./prisma";

const providers: Provider[] = [
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();

    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user, session }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return { ...token, ...user, ...account };
    },
    async session({ session, token, user }) {
      session.token = token.accessToken;
      session.user.id = token.id;
      return { ...session, token: token.accessToken };
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },
});
