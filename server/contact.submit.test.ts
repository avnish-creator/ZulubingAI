import { afterEach, describe, expect, it, vi } from "vitest";

const smtp = vi.hoisted(() => ({
  sendMail: vi.fn(),
  close: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => smtp),
  },
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const createContext = (): TrpcContext => ({
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

afterEach(() => {
  smtp.sendMail.mockReset();
  smtp.close.mockReset();
  vi.unstubAllGlobals();
});

describe("contact.submit", () => {
  it("sends a validated submission through Gmail SMTP", async () => {
    vi.stubEnv("GMAIL_SMTP_APP_PASSWORD", "1234567890123456");
    smtp.sendMail.mockResolvedValue({ messageId: "smtp_message_123" });

    const result = await appRouter.createCaller(createContext()).contact.submit({
      kind: "contact",
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines",
      description: "We need a dependable reporting foundation.",
      honeypot: "",
    });

    expect(result).toEqual({ success: true });
    expect(smtp.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: "Zulubing Website <development.zulubing@gmail.com>",
      to: "development.zulubing@gmail.com",
      replyTo: "ada@example.com",
      subject: expect.stringContaining("New project enquiry"),
    }));
    expect(smtp.close).toHaveBeenCalledOnce();
  });

  it("returns a safe delivery error when Gmail rejects the message", async () => {
    vi.stubEnv("GMAIL_SMTP_APP_PASSWORD", "1234567890123456");
    smtp.sendMail.mockRejectedValue(new Error("SMTP authentication failed"));

    await expect(appRouter.createCaller(createContext()).contact.submit({
      kind: "expert",
      name: "Grace Hopper",
      email: "grace@example.com",
      description: "We need help with an AI-ready data platform.",
      honeypot: "",
    })).rejects.toThrow("Please email development.zulubing@gmail.com directly.");
    expect(smtp.close).toHaveBeenCalledOnce();
  });

  it("silently accepts the honeypot without sending email", async () => {
    vi.stubEnv("GMAIL_SMTP_APP_PASSWORD", "1234567890123456");

    const result = await appRouter.createCaller(createContext()).contact.submit({
      kind: "careers",
      name: "Spam Bot",
      email: "spam@example.com",
      honeypot: "filled",
    });

    expect(result).toEqual({ success: true });
    expect(smtp.sendMail).not.toHaveBeenCalled();
  });
});
