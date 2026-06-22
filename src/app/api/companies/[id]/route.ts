import { NextResponse } from "next/server";
import { prisma, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    isDbConfigured();

    const companyId = params.id;
    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Fetch active jobs for this company
    const jobs = await prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ company, jobs });
  } catch (error: any) {
    console.error("Company fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch company details" }, { status: 500 });
  }
}
