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
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Prisma error getting subscription:", e);
    return null;
  }
}

export async function upgradeSubscriptionAction(
  userId: string,
  plan: "Free" | "Pro" | "Premium" | "Enterprise"
) {
  isDbConfigured();
  try {
    const existing = await prisma.subscription.findFirst({
      where: { userId },
    });

    const now = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + 1);

    if (existing) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          plan,
          status: "Active",
          currentPeriodEnd: end,
          startDate: now,
          endDate: end,
          renewalDate: end,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId,
          plan,
          status: "Active",
          currentPeriodEnd: end,
          startDate: now,
          endDate: end,
          renewalDate: end,
        },
      });
    }

    // Create payment record for paid plans
    if (plan !== "Free") {
      const planPrices: Record<string, number> = {
        Pro: 999,
        Premium: 2499,
        Enterprise: 4999,
      };
      const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      await prisma.payment.create({
        data: {
          userId,
          invoiceId,
          plan,
          amount: planPrices[plan] ?? 999,
          currency: "INR",
          paymentDate: now,
          status: "Paid",
        },
      });
    }

    return { success: true };
  } catch (e) {
    console.error("Prisma error upgrading subscription:", e);
    throw new Error("Failed to upgrade subscription.");
  }
}

export async function cancelSubscriptionAction(userId: string) {
  isDbConfigured();
  try {
    const existing = await prisma.subscription.findFirst({
      where: { userId },
    });
    if (!existing) throw new Error("No subscription found.");
    await prisma.subscription.update({
      where: { id: existing.id },
      data: { status: "Cancelled" },
    });
    return { success: true };
  } catch (e) {
    console.error("Prisma error cancelling subscription:", e);
    throw new Error("Failed to cancel subscription.");
  }
}

export async function getPaymentsAction(userId: string) {
  isDbConfigured();
  try {
    return await prisma.payment.findMany({
      where: { userId },
      orderBy: { paymentDate: "desc" },
    });
  } catch (e) {
    console.error("Prisma error getting payments:", e);
    return [];
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
