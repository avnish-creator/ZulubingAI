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
  it("sends a validated seminar registration through the Gmail API", async () => {
    gmailApi.sendGmailMessage.mockResolvedValue(undefined);

    const result = await appRouter.createCaller(createContext()).workshops.enroll({
      studentName: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+91 90000 00000",
      seminar: "Intro to Data Engineering",
      honeypot: "",
    });

    expect(result).toEqual({ success: true });
    expect(gmailApi.sendGmailMessage).toHaveBeenCalledWith(expect.objectContaining({
      from: "Zulubing Website <development.zulubing@gmail.com>",
      to: "development.zulubing@gmail.com",
      replyTo: "ada@example.com",
      subject: expect.stringContaining("Intro to Data Engineering"),
    }));
  });

  it("returns a safe delivery error when Gmail rejects the message", async () => {
    gmailApi.sendGmailMessage.mockRejectedValue(new Error("Gmail API send failed: 401"));

    await expect(appRouter.createCaller(createContext()).workshops.enroll({
      studentName: "Grace Hopper",
      email: "grace@example.com",
      seminar: "Agentic AI Workshop",
      honeypot: "",
    })).rejects.toThrow("Please email development.zulubing@gmail.com directly.");
  });

  it("silently accepts the honeypot without sending email", async () => {
    const result = await appRouter.createCaller(createContext()).workshops.enroll({
      studentName: "Spam Bot",
      email: "spam@example.com",
      seminar: "Anything",
      honeypot: "filled",
    });

    expect(result).toEqual({ success: true });
    expect(gmailApi.sendGmailMessage).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    await expect(appRouter.createCaller(createContext()).workshops.enroll({
      studentName: "Bad Email",
      email: "not-an-email",
      seminar: "Intro to Data Engineering",
      honeypot: "",
    })).rejects.toThrow();
    expect(gmailApi.sendGmailMessage).not.toHaveBeenCalled();
  });
});
