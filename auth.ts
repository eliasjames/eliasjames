import NextAuth from "next-auth";
import "next-auth/jwt";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const authProviders: Provider[] = [];

import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import vercelKVDriver from "unstorage/drivers/vercel-kv";
import { UnstorageAdapter } from "@auth/unstorage-adapter";

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
});

const insecureCredentialsProviderAllowedForTesting =
  process.env.INSECURE_TESTING_PROVIDER_ON === "true" &&
  process.env.NODE_ENV === "development";

if (insecureCredentialsProviderAllowedForTesting) {
  authProviders.push(
    CredentialsProvider({
      id: "insecure-testing",
      name: "Insecure provider for testing",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      authorize: (credentials) => {
        // use a strong random value:
        // run `$ openssl rand -base64 32` on the command line
        // set in cypress.config.ts and .env
        if (credentials.password === process.env.INSECURE_TESTING_PASSWORD) {
          return {
            email: "test@example.com",
            name: "Insecure Test User",
            image: "https://avatars.githubusercontent.com/u/67470890?s=200&v=4",
          };
        }

        return null;
      },
    }),
  );
} else {
  if (process.env.INSECURE_TESTING_PROVIDER_ON === "true") {
    // "next build" does not respect NODE_ENV: https://github.com/vercel/next.js/issues/4022#issuecomment-374010365
    // if you want to use "next build" locally, temporarily delete the NODE_ENV condition
    // from insecureCredentialsProviderAllowedForTesting above
    console.log(
      "\n\n\nNextJS build set NODE_ENV to ",
      process.env.NODE_ENV,
      "\n\n\n",
    );
  }
}
authProviders.push(
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
);

const pages = {
  signIn: "/login",
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UnstorageAdapter(storage),
  pages,
  providers: authProviders,
  basePath: "/auth",
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      // TODO: un/protected route lookup functions, then set default false
      // TODO: handle auth.message (server config)
      const { pathname } = request.nextUrl;
      if (pathname === "/dashboard") return !!auth;
      return true;
    },
    jwt({ token, trigger, session, account }) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      if (trigger === "update") token.name = session.user.name;
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    session({ session, token }) {
      // TODO: TS thinks token.accessToken is guaranteed, but I don't. Can remove later when confident
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (token?.accessToken) session.accessToken = token.accessToken;

      return session;
    },
  },
  experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

// providerMap for convenience when dynamically rendering
export const providerMap = authProviders
  .map((provider: Provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => {
    if (insecureCredentialsProviderAllowedForTesting) {
      return true;
    }
    return provider.id !== "insecure-testing";
  });
