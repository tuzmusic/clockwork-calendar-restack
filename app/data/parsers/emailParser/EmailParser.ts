import type { Cheerio, Element } from "cheerio";
import * as cheerio from "cheerio";

import EmailGig from "~/data/models/EmailGig";
import { EventPart } from "~/data/models/types";
import { FIRST_MONTH_ROW_INDEX, rowsFromFetchedEmailBody } from "~/data/parsers/emailParser/helpers-and-constants";
import { isMonth, Month } from "~/data/parsers/emailParser/Month";

export default class EmailParser {
  private gigs: EmailGig[] = [];

  private constructor(private html: string) {
  }

  public static parseEmail(html: string): EmailGig[] {
    const parser = new EmailParser(html);
    parser.parse();
    return parser.gigs;
  }

  private $: ReturnType<typeof cheerio.load>;

  private parse() {
    this.$ = cheerio.load(this.html);
    const allScheduleRows = rowsFromFetchedEmailBody($);
    allScheduleRows.each((rowIndex, el) => {
      this.parseRow({ el, atIndex: rowIndex });
    });
  }

  private currentDateMarker!: {
    month: Month,
    year: number
  };

  private currentGigData: Partial<{
    date: string,
    parts: EventPart[],
    location: string,
  }>;

  private parseRow(param: { atIndex: number; el: Element }) {
    const { atIndex: rowIndex, el } = param;
    if (rowIndex < FIRST_MONTH_ROW_INDEX) return true;
    const row = this.$(el);

    if (this.parseMonthHeader(row)) return;


  }

  // If a row is a month header, sets the current month and year.
  // Returns whether the row is a month header
  private parseMonthHeader(row: Cheerio<Element>) {
    if (row.children().length !== 1) return false;

    const [month, yearStr] = row
      .text()
      .split(", ")
      .map((s) => s.trim());
    if (!yearStr || !isMonth(month)) return false;

    const year = Number(yearStr);
    if (!year) return false;

    this.currentDateMarker.month = month;
    this.currentDateMarker.year = year;
    return true;
  }
}
