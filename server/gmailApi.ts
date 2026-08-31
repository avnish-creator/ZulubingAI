const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

export interface GmailOAuthCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export function readGmailOAuthCredentials(): GmailOAuthCredentials | null {
  const clientId = process.env.GMAIL_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GMAIL_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  return { clientId, clientSecret, refreshToken };
}

export async function getGmailAccessToken(credentials: GmailOAuthCredentials): Promise<string> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Gmail OAuth token refresh failed: ${response.status} ${await response.text()}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Gmail OAuth token refresh returned no access token");
  return data.access_token;
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function encodeSubject(subject: string): string {
  return `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;
}

export interface GmailMessage {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}

function buildMimeMessage(message: GmailMessage): string {
  const boundary = `zulubing_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return [
    `From: ${message.from}`,
    `To: ${message.to}`,
    `Reply-To: ${message.replyTo}`,
    `Subject: ${encodeSubject(message.subject)}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    message.text,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "",
    message.html,
    "",
    `--${boundary}--`,
  ].join("\r\n");
}

export async function sendGmailMessage(message: GmailMessage): Promise<void> {
  const credentials = readGmailOAuthCredentials();
  if (!credentials) throw new Error("Gmail OAuth credentials are not configured.");

  const accessToken = await getGmailAccessToken(credentials);

  const response = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: base64UrlEncode(buildMimeMessage(message)) }),
  });

  if (!response.ok) {
    throw new Error(`Gmail API send failed: ${response.status} ${await response.text()}`);
  }
}
