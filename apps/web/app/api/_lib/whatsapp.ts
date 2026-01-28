const apiVersion = process.env.WHATSAPP_API_VERSION ?? "v20.0";
const appSecret = process.env.WHATSAPP_APP_SECRET;

type SendMessageInput = {
  phoneNumberId: string;
  to: string;
  text: string;
  accessToken?: string;
};

export async function sendWhatsAppText({
  phoneNumberId,
  to,
  text,
  accessToken
}: SendMessageInput) {
  const token = accessToken ?? process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) {
    throw new Error("WHATSAPP_ACCESS_TOKEN is required");
  }

  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      text: { body: text }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp send error: ${response.status} ${errorText}`);
  }
}

export function verifyWhatsAppSignature(rawBody: string, signatureHeader: string | null) {
  if (!appSecret) {
    return true;
  }

  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return false;
  }

  const expected = signatureHeader.replace("sha256=", "");
  const crypto = require("crypto") as typeof import("crypto");
  const hmac = crypto.createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  } catch {
    return false;
  }
}
