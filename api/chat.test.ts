import { describe, expect, it, vi } from "vitest";
import handler from "./chat";

const createGroqReplyMock = vi.hoisted(() => vi.fn());
vi.mock("../server/groq", () => ({ createGroqReply: createGroqReplyMock }));

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
  it("returns 400 for malformed JSON without calling Groq", async () => {
    const response = makeResponse();

    await handler({ method: "POST", body: "{not-json" }, response);

    expect(response.statusCode).toBe(400);
    expect(response.payload).toEqual({ error: "Invalid JSON" });
    expect(createGroqReplyMock).not.toHaveBeenCalled();
  });

  it("returns the assistant content for a valid conversation", async () => {
    createGroqReplyMock.mockResolvedValueOnce("Olá, posso ajudar.");
    const response = makeResponse();

    await handler({ method: "POST", body: { messages: [{ role: "user", content: "Quero agendar." }] } }, response);

    expect(response.statusCode).toBe(200);
    expect(response.payload).toEqual({ content: "Olá, posso ajudar." });
    expect(createGroqReplyMock).toHaveBeenCalledWith([{ role: "user", content: "Quero agendar." }]);
  });

  it("rejects unsupported methods", async () => {
    const response = makeResponse();

    await handler({ method: "GET" }, response);

    expect(response.statusCode).toBe(405);
    expect(response.payload).toEqual({ error: "Method not allowed" });
  });
});
