import { NextResponse } from "next/server";
import { prisma } from "../../_lib/db";
import { requireAuth } from "../../_lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { auth, response } = requireAuth(request);
  if (response) return response;

  const company = await prisma.company.findUnique({ where: { id: auth.companyId } });
  if (!company) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(company);
}

export async function PUT(request: Request) {
  const { auth, response } = requireAuth(request);
  if (response) return response;

  const body = await request.json();
  const { name, industry, timezone } = body ?? {};

  const company = await prisma.company.update({
    where: { id: auth.companyId },
    data: {
      name: name ? String(name) : undefined,
      industry: industry ? String(industry) : undefined,
      timezone: timezone ? String(timezone) : undefined
    }
  });

  return NextResponse.json(company);
}
