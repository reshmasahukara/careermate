import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-05-27.dahlia" as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId || "Pro";

      if (userId) {
        // Upgrade the subscription
        const end = new Date();
        end.setMonth(end.getMonth() + 1);

        try {
          const existing = await prisma.subscription.findFirst({
            where: { userId },
          });

          if (existing) {
            await prisma.subscription.update({
              where: { id: existing.id },
              data: {
                plan: planId,
                status: "Active",
                currentPeriodEnd: end,
              },
            });
          } else {
            await prisma.subscription.create({
              data: {
                userId,
                plan: planId,
                status: "Active",
                currentPeriodEnd: end,
              },
            });
          }
        } catch (e) {
          console.error("Prisma error updating subscription from webhook:", e);
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
