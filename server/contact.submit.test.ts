import { afterEach, describe, expect, it, vi } from "vitest";

const gmailApi = vi.hoisted(() => ({
  sendGmailMessage: vi.fn(),
}));

vi.mock("./gmailApi", () => gmailApi);

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const createContext = (): TrpcContext => ({
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

afterEach(() => {
  gmailApi.sendGmailMessage.mockReset();
  vi.unstubAllGlobals();
});

describe("contact.submit", () => {
  it("sends a validated submission through the Gmail API", async () => {
    gmailApi.sendGmailMessage.mockResolvedValue(undefined);

    const result = await appRouter.createCaller(createContext()).contact.submit({
      kind: "contact",
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines",
      description: "We need a dependable reporting foundation.",
      honeypot: "",
    });

    expect(result).toEqual({ success: true });
    expect(gmailApi.sendGmailMessage).toHaveBeenCalledWith(expect.objectContaining({
      from: "Zulubing Website <development.zulubing@gmail.com>",
      to: "development.zulubing@gmail.com",
      replyTo: "ada@example.com",
      subject: expect.stringContaining("New project enquiry"),
    }));
  });

  it("returns a safe delivery error when Gmail rejects the message", async () => {
    gmailApi.sendGmailMessage.mockRejectedValue(new Error("Gmail API send failed: 401"));

    await expect(appRouter.createCaller(createContext()).contact.submit({
      kind: "expert",
      name: "Grace Hopper",
      email: "grace@example.com",
      description: "We need help with an AI-ready data platform.",
      honeypot: "",
    })).rejects.toThrow("Please email development.zulubing@gmail.com directly.");
  });

  it("silently accepts the honeypot without sending email", async () => {
    const result = await appRouter.createCaller(createContext()).contact.submit({
      kind: "careers",
      name: "Spam Bot",
      email: "spam@example.com",
      honeypot: "filled",
    });

    expect(result).toEqual({ success: true });
    expect(gmailApi.sendGmailMessage).not.toHaveBeenCalled();
  });
});
