import * as cheerio from "cheerio";

import EmailGig from "~/data/models/EmailGig";
import { rowsFromFetchedEmailBody } from "~/data/parsers/emailParser/helpers-and-constants";

export default class EmailParser {
  private constructor(private html: string) {
  }

  public static parseEmail(html: string): EmailGig[] {
    const parser = new EmailParser(html);
    return parser.parse();
  }

  private parse(): EmailGig[] {
    const $ = cheerio.load(this.html);
    const allScheduleRows = rowsFromFetchedEmailBody($);
  }
}
