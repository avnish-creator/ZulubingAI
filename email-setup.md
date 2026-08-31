# Zulubing Form Email Delivery

## Purpose

The public Contact, Talk to an Expert, and Careers forms submit through the server and send notifications directly to `development.zulubing@gmail.com` using authenticated Gmail SMTP. The browser never receives or exposes the App Password.

## Required configuration

| Variable | Purpose | Requirement |
| --- | --- | --- |
| `GMAIL_SMTP_APP_PASSWORD` | Authenticates server-side SMTP delivery for `development.zulubing@gmail.com` | Required; use a Google App Password, never the normal Gmail password |

The SMTP user and destination are intentionally fixed to `development.zulubing@gmail.com` in the server delivery procedure. The App Password must belong to that Gmail account and should be revoked and regenerated if it is ever exposed.

## Current delivery behavior

Contact, expert-session, and careers submissions are sent from `development.zulubing@gmail.com` to `development.zulubing@gmail.com`. The visitor’s email is placed in `Reply-To` so the recipient can reply directly. Server-side validation limits field lengths and enforces a valid email address. A hidden honeypot silently drops obvious automated submissions.

The form shows a sending state while the request is in progress. Successful SMTP delivery produces the existing thank-you state. If Gmail rejects the message or the connection is unavailable, the visitor sees a clear recovery message with the direct Zulubing email address.

## Gmail App Password setup

1. Enable 2-Step Verification on the Google account that owns `development.zulubing@gmail.com`.
2. In Google Account Security, create an App Password named `Zulubing Website`.
3. Add the resulting 16-character value to the project’s secure secrets as `GMAIL_SMTP_APP_PASSWORD`.
4. Do not add spaces, quotes, or the value to frontend code, logs, Git, screenshots, or chat.
5. After changing the secret, restart the project server so the new value is loaded.

The server connects to `smtp.gmail.com` over port 587 using STARTTLS and performs authenticated delivery without storing submissions in the database.

## Operational checklist

1. Confirm the Gmail App Password belongs to `development.zulubing@gmail.com`.
2. Submit one real test from `/contact`, `/talk-to-an-expert`, and `/careers`.
3. Confirm all three messages arrive in the inbox or spam folder.
4. Reply to one message and confirm Gmail opens the visitor’s address through Reply-To.
5. Revoke and replace the App Password if it has been shared outside the secure project settings.

## Retired providers

Resend and FormSubmit are not used by the current delivery path. Resend was rejected because the available account quota was exhausted and the prior sender identity was unverified. FormSubmit was not used because its endpoint was unreachable during testing. The application now depends only on the Gmail App Password documented above.
