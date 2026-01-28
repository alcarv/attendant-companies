import { NextResponse } from "next/server";
import { prisma } from "../_lib/db";
import { requireAuth } from "../_lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { auth, response } = requireAuth(request);
  if (response) return response;

  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    companyId: user.companyId
  });
}
