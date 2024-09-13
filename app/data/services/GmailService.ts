import { google } from "googleapis";

import { oauth2Client } from "~/auth/auth0.server";
import { googleTokensCookie } from "~/auth/cookies.server";
import EmailService from "~/data/services/EmailService";

export default class GmailService extends EmailService {

  // todo: these should be accessors (probably store private this.emailData and get from that)
  public html!: string
  public date!: Date | undefined

  // we should just be authenticating before we call the email service right?
  public static async make(request: Request) {
    const cookieHeader = request.headers.get("Cookie") ?? "";
    const auth = (await googleTokensCookie.parse(cookieHeader)) || {};
    oauth2Client.setCredentials(auth);
  }

  public async getMessageBody(): Promise<string> {
    const email = this.getEmailData()
    return
  }

  public async getEmailData(): Promise<{html: string, date: Date | undefined}> {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const messagesResponse = await gmail.users.messages.list({
      userId: "me",
      q: "subject:(\"Clockwork East Coast - Schedule\")"
    });

    const firstMessageThatStartsAThread = messagesResponse.data.messages?.find(m => m.threadId === m.id);
    if (!firstMessageThatStartsAThread?.id) throw Error("firstMessageThatStartsAThread undefined");

    const message = await gmail.users.messages.get({
      id: firstMessageThatStartsAThread.id,
      userId: "me"
    });
    const messageDate = message.data.internalDate
      ? new Date(Number(message.data.internalDate))
      : undefined;
    const html = atob(message.data.payload?.body?.data ?? "");

    this.html = html
    this.date = messageDate

    return { html, date: messageDate };
  }
}
