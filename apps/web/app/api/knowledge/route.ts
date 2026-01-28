import { NextResponse } from "next/server";
import { prisma } from "../_lib/db";
import { requireAuth } from "../_lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { auth, response } = requireAuth(request);
  if (response) return response;

  const knowledge = await prisma.knowledgeSource.findMany({
    where: { companyId: auth.companyId },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(knowledge);
}

export async function POST(request: Request) {
  const { auth, response } = requireAuth(request);
  if (response) return response;

  const body = await request.json();
  const { title, content, type } = body ?? {};

  if (!title || !content) {
    return NextResponse.json({ error: "title and content required" }, { status: 400 });
  }

  const knowledge = await prisma.knowledgeSource.create({
    data: {
      companyId: auth.companyId,
      title: String(title),
      content: String(content),
      type: type ?? "TEXT"
    }
  });

  return NextResponse.json(knowledge, { status: 201 });
}
