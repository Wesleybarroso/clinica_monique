import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { createGroqReply } from "./groq";

vi.mock("./groq", () => ({
  createGroqReply: vi.fn(),
}));

const context: TrpcContext = {
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("ai.chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates input and returns the Groq reply through tRPC", async () => {
    vi.mocked(createGroqReply).mockResolvedValueOnce("A equipe pode orientar você sobre o próximo passo.");
    const caller = appRouter.createCaller(context);

    const result = await caller.ai.chat({
      messages: [{ role: "user", content: "Quero conhecer a clínica geral." }],
    });

    expect(result).toEqual({ content: "A equipe pode orientar você sobre o próximo passo." });
    expect(createGroqReply).toHaveBeenCalledWith([
      { role: "user", content: "Quero conhecer a clínica geral." },
    ]);
  });

  it("rejects empty conversations before calling Groq", async () => {
    const caller = appRouter.createCaller(context);

    await expect(caller.ai.chat({ messages: [] })).rejects.toThrow();
    expect(createGroqReply).not.toHaveBeenCalled();
  });

  it("propagates a provider failure for the UI fallback", async () => {
    vi.mocked(createGroqReply).mockRejectedValueOnce(new Error("Groq request failed"));
    const caller = appRouter.createCaller(context);

    await expect(
      caller.ai.chat({ messages: [{ role: "user", content: "Quero agendar." }] }),
    ).rejects.toThrow("Groq request failed");
  });
});
