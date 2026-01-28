import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../_lib/db";
import { signToken } from "../../_lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body ?? {};

  if (!email || !password) {
    return NextResponse.json({ error: "email and password required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: String(email) } });
  if (!user) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const token = signToken({
    userId: user.id,
    companyId: user.companyId,
    email: user.email
  });

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      companyId: user.companyId
    }
  });
}
