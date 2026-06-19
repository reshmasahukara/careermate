"use server";

import { prisma, isDbConfigured } from "@/lib/db";

export async function updateProfileAction(
  userId: string,
  data: {
    name?: string;
    jobTitle?: string;
    experienceLevel?: string;
    location?: string;
    bio?: string;
  }
) {
  isDbConfigured();
  try {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  } catch (e) {
    console.error("Prisma error updating user profile:", e);
    throw new Error("Failed to update profile.");
  }
}

export async function updateNotificationsAction(
  userId: string,
  data: {
    emailNotifications: boolean;
    jobAlerts: boolean;
    atsAnalysisUpdates: boolean;
    weeklyCareerInsights: boolean;
  }
) {
  isDbConfigured();
  try {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  } catch (e) {
    console.error("Prisma error updating notifications:", e);
    throw new Error("Failed to update notifications.");
  }
}

export async function deleteAccountAction(userId: string) {
  isDbConfigured();
  try {
    // Delete the user and let cascade handle related records
    await prisma.user.delete({
      where: { id: userId },
    });
    return true;
  } catch (e) {
    console.error("Prisma error deleting account:", e);
    throw new Error("Failed to delete account.");
  }
}

export async function getSubscriptionAction(userId: string) {
  isDbConfigured();
  try {
    return await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  } catch (e) {
    console.error("Prisma error getting subscription:", e);
    return null;
  }
}

export async function upgradeSubscriptionAction(userId: string, plan: "Free" | "Pro" | "Premium" | "Enterprise") {
  isDbConfigured();
  try {
    const existing = await prisma.subscription.findFirst({
      where: { userId },
    });

    const end = new Date();
    end.setMonth(end.getMonth() + 1);

    if (existing) {
      return await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          plan,
          status: "Active",
          currentPeriodEnd: end,
        },
      });
    } else {
      return await prisma.subscription.create({
        data: {
          userId,
          plan,
          status: "Active",
          currentPeriodEnd: end,
        },
      });
    }
  } catch (e) {
    console.error("Prisma error upgrading subscription:", e);
    throw new Error("Failed to upgrade subscription.");
  }
}

export async function getNotificationsAction(userId: string) {
  isDbConfigured();
  try {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Prisma error getting notifications:", e);
    return [];
  }
}

export async function markNotificationsAsReadAction(userId: string) {
  isDbConfigured();
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return true;
  } catch (e) {
    console.error("Prisma error marking notifications:", e);
    return false;
  }
}
