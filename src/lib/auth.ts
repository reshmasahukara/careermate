import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma, isDbConfigured } from "@/lib/db";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is missing");
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "alex@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        isDbConfigured();

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user) {
            console.warn(`Auth failed: User not found for email ${credentials.email}`);
            throw new Error("Invalid email or password.");
          }

          if (user.lockedUntil && user.lockedUntil > new Date()) {
            console.warn(`Auth failed: User ${credentials.email} is locked out.`);
            throw new Error("Account locked due to too many failed attempts. Try again later.");
          }

          if (!user.password) {
            console.warn(`Auth failed: User ${credentials.email} signed up with OAuth, no password exists.`);
            throw new Error("You previously signed up with a different provider (e.g. Google). Please use that to log in.");
          }

          if (!user.emailVerified) {
            console.warn(`Auth failed: User ${credentials.email} has not verified their email.`);
            throw new Error("Please verify your email before signing in.");
          }

          const bcrypt = await import("bcryptjs");
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

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
            console.warn(`Auth failed: Incorrect password for email ${credentials.email}`);
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

          // If the error was one of our manually thrown user errors, pass it through.
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
    async jwt({ token, user, account }) {
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
};
