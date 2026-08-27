import { afterEach, describe, expect, it, vi } from "vitest";
import { createGroqReply } from "./groq";

describe("createGroqReply", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("sends the conversation to Groq and returns the assistant text", async () => {
    vi.stubEnv("GROQ_API_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "Posso ajudar você a encontrar o próximo passo." } }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const reply = await createGroqReply([{ role: "user", content: "Quero saber sobre estética dental." }]);

    expect(reply).toContain("próximo passo");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-key" }),
      }),
    );

    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(request.body)) as { model: string; messages: Array<{ role: string; content: string }> };
    expect(body.model).toBe("openai/gpt-oss-20b");
    expect(body.messages[0]?.role).toBe("system");
    expect(body.messages[0]?.content).toContain("português brasileiro");
    expect(body.messages.at(-1)).toEqual({ role: "user", content: "Quero saber sobre estética dental." });
  });
});
