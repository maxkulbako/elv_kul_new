import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcrypt-ts-edge";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Check if credentials are valid
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Check if user exists and has a password
        if (user && user.password) {
          // Check if password is valid
          const isPasswordsMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // Check if password is valid
          if (isPasswordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        }

        // If user does not exist or password is invalid, return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }) {
      // Set the user ID from the token
      session.user.id = token.sub as string;
      session.user.role = token.role as "CLIENT" | "ADMIN";
      // If is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name as string;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
});
