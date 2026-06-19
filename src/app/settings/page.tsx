import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import SettingsLayout from "@/components/settings/SettingsLayout";

export const metadata = {
  title: "Settings | CareerMate",
  description: "Manage your CareerMate account and preferences.",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch full user data including new profile and notification fields
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    redirect("/login");
  }

  // Fetch subscription
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout>
      <SettingsLayout user={dbUser} subscription={subscription} />
    </DashboardLayout>
  );
}
