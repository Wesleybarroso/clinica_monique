import { afterEach, describe, expect, it, vi } from "vitest";
import handler from "../api/chat";

type MockResponse = {
  statusCode?: number;
  payload?: unknown;
  status: (code: number) => MockResponse;
  json: (payload: unknown) => void;
};

const makeResponse = (): MockResponse => {
  const response = {
    statusCode: undefined,
    payload: undefined,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      response.payload = payload;
    },
  };
  return response;
};

describe("Vercel chat handler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns 400 for malformed JSON without calling Groq", async () => {
    const response = makeResponse();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await handler({ method: "POST", body: "{not-json" }, response);

    expect(response.statusCode).toBe(400);
    expect(response.payload).toEqual({ error: "Invalid JSON" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns the assistant content for a valid conversation", async () => {
    vi.stubEnv("GROQ_API_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "Olá, posso ajudar." } }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const response = makeResponse();

    await handler({ method: "POST", body: { messages: [{ role: "user", content: "Quero agendar." }] } }, response);

    expect(response.statusCode).toBe(200);
    expect(response.payload).toEqual({ content: "Olá, posso ajudar." });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-key" }),
      }),
    );
  });

  it("returns 502 when the provider is unavailable", async () => {
    vi.stubEnv("GROQ_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("upstream error", { status: 503 })));
    const response = makeResponse();

    await handler({ method: "POST", body: { messages: [{ role: "user", content: "Olá" }] } }, response);

    expect(response.statusCode).toBe(502);
    expect(response.payload).toEqual({ error: "Assistant unavailable" });
  });

  it("rejects unsupported methods", async () => {
    const response = makeResponse();

    await handler({ method: "GET" }, response);

    expect(response.statusCode).toBe(405);
    expect(response.payload).toEqual({ error: "Method not allowed" });
  });
});
