import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcrypt-ts-edge";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV !== "production",
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
        // Якщо немає email або пароля, не продовжуємо
        if (!credentials.email || !credentials.password) {
          return null;
        }

        try {
          // Спроба знайти користувача в базі даних
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          // Якщо користувач знайдений і має пароль
          if (user && user.password) {
            // Перевіряємо, чи співпадає пароль
            const isPasswordsMatch = compareSync(
              credentials.password as string,
              user.password
            );

            // Якщо паролі співпадають, повертаємо користувача
            if (isPasswordsMatch) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
          }
        } catch (error) {
          // Логуємо детальну помилку в CloudWatch
          console.error("AUTHORIZE ERROR:", error);
          // Повертаємо null, щоб автентифікація не пройшла
          return null;
        }

        // Якщо користувач не знайдений або пароль невірний
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
        token.id = user.id as string;
        token.role = user.role as "CLIENT" | "ADMIN";
      }
      return token;
    },
  },
});
