"use server";

import { prisma, isDbConfigured } from "@/lib/db";
import { mockDb } from "@/lib/mockData";

export async function updateProfileAction(userId: string, name: string) {
  if (isDbConfigured()) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    } catch (e) {
      console.error("Prisma error updating user name:", e);
    }
  }
  return mockDb.updateUser(userId, name);
}

export async function getSubscriptionAction(userId: string) {
  if (isDbConfigured()) {
    try {
      return await prisma.subscription.findFirst({
        where: { userId },
      });
    } catch (e) {
      console.error("Prisma error getting subscription:", e);
    }
  }
  return mockDb.getSubscription(userId);
}

export async function upgradeSubscriptionAction(userId: string, plan: "Free" | "Pro" | "Premium" | "Enterprise") {
  if (isDbConfigured()) {
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
    }
  }
  return mockDb.createSubscription(userId, plan);
}

export async function getNotificationsAction(userId: string) {
  if (isDbConfigured()) {
    try {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.error("Prisma error getting notifications:", e);
    }
  }
  return mockDb.getNotifications(userId);
}

export async function markNotificationsAsReadAction(userId: string) {
  if (isDbConfigured()) {
    try {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      return true;
    } catch (e) {
      console.error("Prisma error marking notifications:", e);
    }
  }
  mockDb.markNotificationsAsRead(userId);
  return true;
}
