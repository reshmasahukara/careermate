import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    isDbConfigured();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId }
    });

    return NextResponse.json({ success: true, savedJobs });
  } catch (error: any) {
    console.error("Fetch saved jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    isDbConfigured();

    const body = await request.json();
    const { userId, jobId } = body;

    if (!userId || !jobId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const savedJob = await prisma.savedJob.upsert({
      where: {
        userId_jobId: { userId, jobId }
      },
      update: {}, // if exists, do nothing
      create: {
        userId,
        jobId
      }
    });

    return NextResponse.json({ success: true, savedJob });
  } catch (error: any) {
    console.error("Save job error:", error);
    return NextResponse.json(
      { error: "Failed to save job" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    isDbConfigured();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const jobId = searchParams.get("jobId");

    if (!userId || !jobId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.savedJob.delete({
      where: {
        userId_jobId: { userId, jobId }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Unsave job error:", error);
    return NextResponse.json(
      { error: "Failed to unsave job" },
      { status: 500 }
    );
  }
}
