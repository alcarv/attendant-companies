import { NextResponse } from "next/server";
import { prisma } from "../../_lib/db";
import { requireAuth } from "../../_lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { auth, response } = requireAuth(request);
  if (response) return response;

  const config = await prisma.whatsAppConfig.findUnique({
    where: { companyId: auth.companyId }
  });

  return NextResponse.json(config);
}

export async function POST(request: Request) {
  const { auth, response } = requireAuth(request);
  if (response) return response;

  const body = await request.json();
  const { phoneNumberId, businessId, accessToken, verifyToken } = body ?? {};

  if (!phoneNumberId || !businessId || !accessToken || !verifyToken) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const config = await prisma.whatsAppConfig.upsert({
    where: { companyId: auth.companyId },
    update: {
      phoneNumberId: String(phoneNumberId),
      businessId: String(businessId),
      accessToken: String(accessToken),
      verifyToken: String(verifyToken)
    },
    create: {
      companyId: auth.companyId,
      phoneNumberId: String(phoneNumberId),
      businessId: String(businessId),
      accessToken: String(accessToken),
      verifyToken: String(verifyToken)
    }
  });

  return NextResponse.json(config);
}
