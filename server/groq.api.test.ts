import { describe, expect, it } from "vitest";

describe("Groq API credentials", () => {
  it("runs the live credential probe only when explicitly enabled", async () => {
    if (process.env.RUN_LIVE_GROQ_TEST !== "1") {
      expect(true).toBe(true);
      return;
    }

    const apiKey = process.env.GROQ_API_KEY;
    expect(apiKey, "GROQ_API_KEY must be configured for the live integration probe").toBeTruthy();

    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { data?: unknown[] };
    expect(Array.isArray(payload.data)).toBe(true);
  }, 15_000);
});
