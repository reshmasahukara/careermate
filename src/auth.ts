import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, isDbConfigured } from "@/lib/db";
import bcrypt from "bcryptjs";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is missing");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@careermate.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        isDbConfigured();

        try {
          const emailStr = credentials.email as string;
          const passwordStr = credentials.password as string;

          const user = await prisma.user.findUnique({
            where: { email: emailStr.toLowerCase() },
          });

          if (!user) {
            console.warn(`Auth failed: User not found for email ${emailStr}`);
            throw new Error("Invalid email or password.");
          }

          if (user.lockedUntil && user.lockedUntil > new Date()) {
            console.warn(`Auth failed: User ${emailStr} is locked out.`);
            throw new Error("Account locked due to too many failed attempts. Try again later.");
          }

          if (!user.password) {
            console.warn(`Auth failed: User ${emailStr} signed up with OAuth, no password exists.`);
            throw new Error("You previously signed up with a different provider (e.g. Google). Please use that to log in.");
          }

          if (!user.emailVerified) {
            console.warn(`Auth failed: User ${emailStr} has not verified their email.`);
            throw new Error("Please verify your email before signing in.");
          }

          const isPasswordValid = await bcrypt.compare(passwordStr, user.password);

          if (!isPasswordValid) {
            const newAttempts = user.failedLoginAttempts + 1;
            let newLockedUntil = null;
            if (newAttempts >= 5) {
              newLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
            }
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: newAttempts,
                lockedUntil: newLockedUntil,
              },
            });
            console.warn(`Auth failed: Incorrect password for email ${emailStr}`);
            throw new Error("Invalid email or password.");
          }

          if (user.failedLoginAttempts > 0) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error: any) {
          console.error("Prisma authorize error:", error.message || error);
          if (error.code === "P1001" || error.message?.includes("Can't reach database server")) {
            throw new Error("Unable to connect right now. Please try again later.");
          }
          if (
            error.message === "Invalid email or password." ||
            error.message === "Please verify your email before signing in." ||
            error.message.includes("previously signed up") ||
            error.message.includes("Account locked")
          ) {
            throw new Error(error.message);
          }
          throw new Error("Unable to sign in. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
