import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../_lib/db";
import { signToken } from "../../_lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name, companyName, industry, timezone } = body ?? {};

  if (!email || !password || !companyName) {
    return NextResponse.json(
      { error: "email, password, companyName required" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email: String(email) } });
  if (existing) {
    return NextResponse.json({ error: "email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(String(password), 12);

  const result = await prisma.$transaction(async (tx: typeof prisma) => {
    const company = await tx.company.create({
      data: {
        name: String(companyName),
        industry: industry ? String(industry) : null,
        timezone: timezone ? String(timezone) : null
      }
    });

    const user = await tx.user.create({
      data: {
        email: String(email),
        passwordHash,
        name: name ? String(name) : null,
        companyId: company.id
      }
    });

    await tx.agent.create({
      data: {
        name: "Atendente principal",
        companyId: company.id,
        model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        systemPrompt:
          "Você é um atendente virtual da empresa. Responda com clareza, objetividade e em português do Brasil."
      }
    });

    return { company, user };
  });

  const token = signToken({
    userId: result.user.id,
    companyId: result.company.id,
    email: result.user.email
  });

  return NextResponse.json(
    {
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        companyId: result.company.id
      }
    },
    { status: 201 }
  );
}
