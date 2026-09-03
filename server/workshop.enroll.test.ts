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

describe("workshops.enroll", () => {
  it("sends a validated workshop registration through the Gmail API", async () => {
    gmailApi.sendGmailMessage.mockResolvedValue(undefined);

    const result = await appRouter.createCaller(createContext()).workshops.enroll({
      studentName: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+91 90000 00000",
      jobReadyInterest: true,
      honeypot: "",
    });

    expect(result).toEqual({ success: true });
    expect(gmailApi.sendGmailMessage).toHaveBeenCalledWith(expect.objectContaining({
      from: "Zulubing Website <development.zulubing@gmail.com>",
      to: "development.zulubing@gmail.com",
      replyTo: "ada@example.com",
      subject: expect.stringContaining("Data Analytics Workshop"),
    }));
  });

  it("returns a safe delivery error when Gmail rejects the message", async () => {
    gmailApi.sendGmailMessage.mockRejectedValue(new Error("Gmail API send failed: 401"));

    await expect(appRouter.createCaller(createContext()).workshops.enroll({
      studentName: "Grace Hopper",
      email: "grace@example.com",
      honeypot: "",
    })).rejects.toThrow("Please email development.zulubing@gmail.com directly.");
  });

  it("silently accepts the honeypot without sending email", async () => {
    const result = await appRouter.createCaller(createContext()).workshops.enroll({
      studentName: "Spam Bot",
      email: "spam@example.com",
      honeypot: "filled",
    });

    expect(result).toEqual({ success: true });
    expect(gmailApi.sendGmailMessage).not.toHaveBeenCalled();
  });

  it("reports the job-ready opt-in as an explicit No when unchecked", async () => {
    gmailApi.sendGmailMessage.mockResolvedValue(undefined);

    await appRouter.createCaller(createContext()).workshops.enroll({
      studentName: "Alan Turing",
      email: "alan@example.com",
      honeypot: "",
    });

    const sent = gmailApi.sendGmailMessage.mock.calls[0][0] as { html: string; text: string };
    expect(sent.text).toContain("Job-ready sessions: No");
    expect(sent.html).toContain("Interested in job-ready live sessions");
  });

  it("rejects an invalid email address", async () => {
    await expect(appRouter.createCaller(createContext()).workshops.enroll({
      studentName: "Bad Email",
      email: "not-an-email",
      honeypot: "",
    })).rejects.toThrow();
    expect(gmailApi.sendGmailMessage).not.toHaveBeenCalled();
  });
});
