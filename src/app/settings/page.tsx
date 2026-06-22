import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import SettingsLayout from "@/components/settings/SettingsLayout";

export const metadata = {
  title: "Settings | CareerMate",
  description: "Manage your CareerMate account and preferences.",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <DashboardLayout>
        <div />
      </DashboardLayout>
    );
  }

  const userId = (session.user as any).id;

  // Fetch full user data including new profile and notification fields
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    return (
      <DashboardLayout>
        <div />
      </DashboardLayout>
    );
  }

  // Fetch subscription
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Fetch usage statistics
  const [resumeCount, atsCount, savedJobCount, payments] = await Promise.all([
    prisma.resume.count({ where: { userId } }),
    prisma.aTSAnalysis.count({ where: { userId } }),
    prisma.savedJob.count({ where: { userId } }),
    prisma.payment.findMany({
      where: { userId },
      orderBy: { paymentDate: "desc" },
    }),
  ]);

  return (
    <DashboardLayout>
      <SettingsLayout
        user={dbUser}
        subscription={subscription}
        usageStats={{ resumeCount, atsCount, savedJobCount }}
        payments={payments}
      />
    </DashboardLayout>
  );
}
