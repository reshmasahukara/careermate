import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    isDbConfigured();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const applications = await prisma.applicationTracker.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        job: true
      }
    });

    return NextResponse.json({ applications });
  } catch (error: any) {
    console.error("Fetch applications error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    isDbConfigured();
    const body = await request.json();
    const { userId, jobId, company, title, status } = body;

    if (!userId || !company || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newApp = await prisma.applicationTracker.create({
      data: {
        userId,
        jobId: jobId || undefined,
        company,
        title,
        status: status || "Applied"
      }
    });

    return NextResponse.json({ success: true, application: newApp });
  } catch (error: any) {
    console.error("Create application error:", error);
    return NextResponse.json({ error: "Failed to create application tracker" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    isDbConfigured();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const updatedApp = await prisma.applicationTracker.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, application: updatedApp });
  } catch (error: any) {
    console.error("Update application error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    isDbConfigured();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.applicationTracker.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete application error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
