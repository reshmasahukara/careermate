import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const report = await prisma.aTSAnalysis.findUnique({
      where: { id }
    });

    if (!report) {
      return NextResponse.json({ error: "Analysis report not found." }, { status: 404 });
    }

    if (report.userId !== userId) {
      return NextResponse.json({ error: "Access denied. You do not own this report." }, { status: 403 });
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("ATS Report detail GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve report details." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const report = await prisma.aTSAnalysis.findUnique({
      where: { id }
    });

    if (!report) {
      return NextResponse.json({ error: "Analysis report not found." }, { status: 404 });
    }

    if (report.userId !== userId) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    await prisma.aTSAnalysis.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Report deleted successfully." });
  } catch (error: any) {
    console.error("ATS Report DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete report." }, { status: 500 });
  }
}
