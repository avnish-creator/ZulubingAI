import { describe, expect, it } from "vitest";
import { getGmailAccessToken, readGmailOAuthCredentials } from "./gmailApi";

describe("Gmail API OAuth configuration", () => {
  it("obtains an access token without sending a message", async () => {
    const credentials = readGmailOAuthCredentials();
    expect(credentials, "GMAIL_OAUTH_CLIENT_ID, GMAIL_OAUTH_CLIENT_SECRET and GMAIL_OAUTH_REFRESH_TOKEN must be configured").toBeTruthy();

    const accessToken = await getGmailAccessToken(credentials!);
    expect(accessToken).toBeTruthy();
  }, 30_000);
});
