type KnowledgeSource = {
  title: string;
  content: string;
};

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required");
}

type GenerateInput = {
  systemPrompt: string;
  userMessage: string;
  knowledge: KnowledgeSource[];
};

export async function generateAgentReply({
  systemPrompt,
  userMessage,
  knowledge
}: GenerateInput) {
  const knowledgeText = knowledge
    .map((item) => `- ${item.title}: ${item.content}`)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: `${systemPrompt}\n\nConhecimento da empresa:\n${knowledgeText}`
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };

  if (data.output_text) {
    return data.output_text;
  }

  const text =
    data.output
      ?.flatMap((item) => item.content ?? [])
      .filter((part) => part.type === "output_text")
      .map((part) => part.text)
      .filter(Boolean)
      .join(" ") ?? "";

  return text || "Desculpe, não consegui responder agora.";
}
