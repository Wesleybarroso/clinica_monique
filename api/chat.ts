import { createGroqReply } from "../server/groq";

type RequestLike = {
  method?: string;
  body?: unknown;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (payload: unknown) => void;
  setHeader?: (name: string, value: string) => void;
};

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body: unknown;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  const messages = (body as { messages?: unknown } | undefined)?.messages;

  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12) {
    res.status(400).json({ error: "Invalid messages" });
    return;
  }

  const validMessages = messages.filter((message): message is { role: "user" | "assistant"; content: string } => {
    if (!message || typeof message !== "object") return false;
    const candidate = message as { role?: unknown; content?: unknown };
    return (candidate.role === "user" || candidate.role === "assistant")
      && typeof candidate.content === "string"
      && candidate.content.trim().length > 0
      && candidate.content.length <= 1200;
  });

  if (validMessages.length !== messages.length) {
    res.status(400).json({ error: "Invalid message format" });
    return;
  }

  try {
    const content = await createGroqReply(validMessages);
    res.status(200).json({ content });
  } catch (error) {
    console.error("[Vercel Chat] Groq request failed", error instanceof Error ? error.message : error);
    res.status(502).json({ error: "Assistant unavailable" });
  }
}
