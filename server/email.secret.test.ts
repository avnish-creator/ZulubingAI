import { describe, expect, it } from "vitest";

describe("Resend configuration", () => {
  it("accepts the configured API key for a read-only account request", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.ok, `Resend credential check failed with ${response.status}`).toBe(true);
  }, 15_000);
});
