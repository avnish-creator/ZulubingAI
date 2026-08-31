import { describe, expect, it } from "vitest";
import nodemailer from "nodemailer";

describe("Gmail SMTP configuration", () => {
  it("authenticates without sending a message", async () => {
    const password = process.env.GMAIL_SMTP_APP_PASSWORD;
    expect(password, "GMAIL_SMTP_APP_PASSWORD must be configured").toBeTruthy();
    expect(password).toMatch(/^.{16}$/);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "development.zulubing@gmail.com",
        pass: password,
      },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 15_000,
    });

    await expect(transporter.verify()).resolves.toBe(true);
    transporter.close();
  }, 30_000);
});
