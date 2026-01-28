import { NextResponse } from "next/server";
import { prisma } from "../../_lib/db";
import { generateAgentReply } from "../../_lib/openai";
import { sendWhatsAppText, verifyWhatsAppSignature } from "../../_lib/whatsapp";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const envToken = process.env.WHATSAPP_VERIFY_TOKEN;
  const matchesEnv = envToken && token === envToken;

  const matchesDb = token
    ? Boolean(
        await prisma.whatsAppConfig.findFirst({
          where: { verifyToken: String(token) }
        })
      )
    : false;

  if (mode === "subscribe" && (matchesEnv || matchesDb)) {
    return new Response(challenge ?? "", { status: 200 });
  }

  return new Response("forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  if (!verifyWhatsAppSignature(rawBody, signature)) {
    return new Response("invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const entry = payload?.entry?.[0];
  const change = entry?.changes?.[0]?.value;
  const message = change?.messages?.[0];

  if (!message || !change?.metadata?.phone_number_id) {
    return NextResponse.json({ ok: true });
  }

  const phoneNumberId = String(change.metadata.phone_number_id);
  const from = String(message.from);
  const text = message.text?.body;

  if (!text) {
    return NextResponse.json({ ok: true });
  }

  try {
    const config = await prisma.whatsAppConfig.findFirst({
      where: { phoneNumberId }
    });

    if (!config) {
      return NextResponse.json({ ok: true });
    }

    const agent = await prisma.agent.findFirst({
      where: { companyId: config.companyId },
      orderBy: { createdAt: "asc" }
    });

    if (!agent) {
      return NextResponse.json({ ok: true });
    }

    const conversation = await prisma.conversation.upsert({
      where: {
        companyId_customerPhone: {
          companyId: config.companyId,
          customerPhone: from
        }
      },
      update: {},
      create: {
        companyId: config.companyId,
        agentId: agent.id,
        customerPhone: from
      }
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: text
      }
    });

    const knowledge = await prisma.knowledgeSource.findMany({
      where: { companyId: config.companyId },
      orderBy: { createdAt: "desc" },
      take: 12
    });

    const reply = await generateAgentReply({
      systemPrompt: agent.systemPrompt,
      userMessage: text,
      knowledge
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: reply
      }
    });

    await sendWhatsAppText({
      phoneNumberId,
      to: from,
      text: reply,
      accessToken: config.accessToken ?? undefined
    });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
  }

  return NextResponse.json({ ok: true });
}
