import { buildEvent, buildHtml, buildMonthHeader, buildOtherPart } from "~/data/parsers/emailParser/tests/htmlBuilders";
import EmailService from "~/data/services/EmailService";

export default class EmailFixtureService extends EmailService {
  public async getMessageBody(): Promise<string> {
    const html = buildHtml(
      buildMonthHeader('July'),
      buildEvent({ dateNum: 8 }),
      buildEvent({ dateNum: 9 }),
      buildOtherPart({ timeStr: "5:00-6:00", part: "Cocktail Hour" }),
      buildMonthHeader('August'),
      buildEvent({ dateNum: 18 }),
      buildEvent({ dateNum: 19 })
    )
    return Promise.resolve(html);
  }
}
