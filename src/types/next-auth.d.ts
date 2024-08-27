import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    token: ?accessToken;
    user: User & DefaultSession["user"];
  }
}
