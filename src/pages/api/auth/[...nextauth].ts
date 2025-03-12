import NextAuth, { NextAuthOptions } from "next-auth";
import prisma from "../../../lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        const isValid = await bcrypt.compare(
          credentials?.password ?? "",
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      let storedUser = await prisma.user.findUnique({
        where: { email: user.email ?? "" },
      });
      if (!storedUser) {
        storedUser = await prisma.user.create({
          data: {
            email: user.email ?? "",
            firstName: profile?.name?.split(" ")[0] ?? "",
            lastName: profile?.name?.split(" ")[1] ?? "",
            preferredName: profile?.name?.split(" ")[0] ?? "",
          },
        });
      }

      user.id = storedUser.id;
      user.name = storedUser.firstName + " " + storedUser.lastName;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id?.toString() ?? "",
          name: token.name ?? "",
        };
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          shelterId: token.shelterId,
        },
      };
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
