# Zulubing Form Email Delivery

## Purpose

The public Contact, Talk to an Expert, and Careers forms submit through the server and send notifications directly to `development.zulubing@gmail.com` using the Gmail API (OAuth2, over HTTPS). The browser never receives or exposes any credential.

## Why not SMTP

The previous implementation connected directly to `smtp.gmail.com:587` using an App Password. Render (and many hosts) block outbound traffic on SMTP ports (25, 465, 587) at the network level to prevent spam abuse, so that connection always times out in production even with correct credentials. Sending through Gmail's REST API instead goes over standard HTTPS (443), which is not blocked.

## Required configuration

| Variable | Purpose |
| --- | --- |
| `GMAIL_OAUTH_CLIENT_ID` | OAuth2 client ID from the Google Cloud project authorized to send as `development.zulubing@gmail.com` |
| `GMAIL_OAUTH_CLIENT_SECRET` | OAuth2 client secret paired with the client ID |
| `GMAIL_OAUTH_REFRESH_TOKEN` | Long-lived refresh token issued to `development.zulubing@gmail.com` with the `gmail.send` scope |

All three must be set for delivery to work; the server exchanges the refresh token for a short-lived access token on every send (`server/gmailApi.ts`).

## One-time setup: obtaining the OAuth credentials

1. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project, then go to **APIs & Services → Library**, search for **Gmail API**, and enable it.
2. Go to **APIs & Services → OAuth consent screen** and configure it (External type is fine; add `development.zulubing@gmail.com` as a test user if the app stays in Testing mode).
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**, application type **Web application**, and add `https://developers.google.com/oauthplayground` as an authorized redirect URI. Save, then copy the generated **Client ID** and **Client Secret**.
4. Open [Google OAuth Playground](https://developers.google.com/oauthplayground/), click the gear icon (top right), check **Use your own OAuth credentials**, and paste in the Client ID and Client Secret from step 3.
5. In Step 1 of the playground, enter the scope `https://www.googleapis.com/auth/gmail.send`, click **Authorize APIs**, and sign in as `development.zulubing@gmail.com` when prompted.
6. In Step 2, click **Exchange authorization code for tokens** and copy the **Refresh token** shown.
7. Add all three values to Render's environment variables as `GMAIL_OAUTH_CLIENT_ID`, `GMAIL_OAUTH_CLIENT_SECRET`, and `GMAIL_OAUTH_REFRESH_TOKEN`, then redeploy.
8. Do not add these values to frontend code, logs, Git, screenshots, or chat. If any of them are ever exposed, revoke access for the OAuth client in Google Cloud Console and repeat this setup.

## Current delivery behavior

Contact, expert-session, and careers submissions are sent from `development.zulubing@gmail.com` to `development.zulubing@gmail.com`. The visitor's email is placed in `Reply-To` so the recipient can reply directly. Server-side validation limits field lengths and enforces a valid email address. A hidden honeypot silently drops obvious automated submissions.

The form shows a sending state while the request is in progress. Successful delivery produces the existing thank-you state. If the Gmail API rejects the message or the connection is unavailable, the visitor sees a clear recovery message with the direct Zulubing email address.

## Operational checklist

1. Confirm all three `GMAIL_OAUTH_*` variables are set on Render and belong to `development.zulubing@gmail.com`.
2. Submit one real test from `/contact`, `/talk-to-an-expert`, and `/careers` against the live Render URL.
3. Confirm all three messages arrive in the inbox or spam folder.
4. Reply to one message and confirm Gmail opens the visitor's address through Reply-To.
5. If delivery fails, check the Render logs for a line starting with `[Email] Gmail API delivery failed` — it includes the HTTP status and response body from Google.
6. Revoke and re-issue the refresh token if it has been shared outside the secure project settings.

## Retired providers

Resend and FormSubmit are not used by the current delivery path. Resend was rejected because the available account quota was exhausted and the prior sender identity was unverified. FormSubmit was not used because its endpoint was unreachable during testing. Direct Gmail SMTP (App Password) was retired because Render blocks outbound SMTP ports. The application now depends only on the Gmail API OAuth2 credentials documented above.
