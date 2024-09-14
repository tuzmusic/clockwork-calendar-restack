import { google } from "googleapis";

import { oauth2Client } from "~/auth/auth0.server";
import { googleTokensCookie } from "~/auth/cookies.server";
import EmailService from "~/data/services/EmailService";

export default class GmailServiceServer extends EmailService {

  private emailData?: {
    html: string, date: Date | undefined
  };

  public get messageBody() {
    return this.emailData?.html;
  }

  public get messageDate() {
    return this.emailData?.date;
  }

  // we should just be authenticating before we call the email service right?
  public static async make(request: Request) {
    const cookieHeader = request.headers.get("Cookie") ?? "";
    const auth = (await googleTokensCookie.parse(cookieHeader)) || {};
    oauth2Client.setCredentials(auth);

    return new this()
  }

  public async getMessageBody(): Promise<string> {
    if (!this.messageBody) {
      await this.getEmailData();
    }
    return this.messageBody ?? "Could not get message body?";
  }

  public async getEmailData(): Promise<void> {
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
    const bodyData = message.data.payload?.body?.data;
    const html = atob(bodyData ?? "");

    this.emailData = {
      date: messageDate, html
    };
  }
}
