import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  secret: process.env.BETTERAUTH_SECRET!,
  providers: [
    {
      id: "google",
      type: "oauth",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    {
      id: "github",
      type: "oauth",
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  ],
  plugins: [nextCookies()],
});
