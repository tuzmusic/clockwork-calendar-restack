import type { Cheerio, Element } from "cheerio";
import * as cheerio from "cheerio";

import EmailGig from "~/data/models/EmailGig";
import { EventPart } from "~/data/models/types";
import { EVENT_CELLS_COUNT, FIRST_MONTH_ROW_INDEX } from "~/data/parsers/emailParser/helpers-and-constants";
import { isMonth, Month } from "~/data/parsers/emailParser/Month";


interface EventPartData {
  type: EventPart["type"];
  rawTimeStr: string;
}

export default class EmailParser {

  private gigs: EmailGig[] = [];

  private constructor(private html: string) {
    this.$ = cheerio.load(this.html);
  }

  public static parseEmail(html: string): EmailGig[] {
    const parser = new EmailParser(html);
    parser.parse();
    return parser.gigs;
  }

  private readonly $: ReturnType<typeof cheerio.load>;

  private getRowsFromEmailBody() {
    return this.$("body > table > tbody").find("tr");
  }

  private parse() {
    const allScheduleRows = this.getRowsFromEmailBody();
    allScheduleRows.each((rowIndex, el) => {
      this.parseRow({ el, atIndex: rowIndex });
    });
  }

  private currentDateMarker!: {
    month: Month,
    year: number
  };

  private currentGigData: Partial<{
    dateParts: {
      date: number, month: Month, year: number
    },
    parts: EventPartData[],
    location: string,
  }> | null = null;

  private parseRow(param: { atIndex: number; el: Element }) {
    const { atIndex: rowIndex, el } = param;
    if (rowIndex < FIRST_MONTH_ROW_INDEX) return true;
    const row = this.$(el);

    if (this.parseMonthHeader(row)) return;
    if (this.parseGig(row)) return;

  }

  /**
   * If a row is a month header, sets the current month and year.
   * @returns whether the row is a month header
   */
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

  private parseGig(row: Cheerio<Element>) {
    const tds = row.children("td");
    if (tds.length !== EVENT_CELLS_COUNT) return false;

    /* TODO: previously pushed the completed event when finding a new event
    *   We *probably* want to do this here, but it feels like it belongs elsewhere,
    *   So hold off for now
    * */

    const [DATE, TIME, LOCATION] = [1, 3, 4]; // td indices
    tds.each((tdIndex, el) => {
      const text = cheerio.load(el)("td").text().trim();
      switch (tdIndex) {
        case 0:
        case 2:
          break;
        case DATE:
          return this.parseDate(text);
        case TIME:
          return this.parseReceptionTime(text);
        case LOCATION:
          return this.parseLocation(text);
      }
    });
  }

  private parseDate(text: string) {
    this.checkEvent("parseDate")

    const date = Number(text);
    if (!date) throw EmailParser.errors.couldntFindDate;

    const { month, year } = this.currentDateMarker;
    this.currentGigData!.dateParts = {
      date, year, month
    };
  }

  private getDateTimeStr(time: string) {
    if (!this.currentGigData?.dateParts) {
      throw EmailParser.errors.datePartsNotSet('getDateTimeStr')
    }

    const { date, month, year } = this.currentGigData.dateParts

    // assuming events will never end past 12:59am
    const am = time.split(':').shift()?.startsWith('12')
    const dateStr = `${month} ${date + (am ? 1 : 0)} ${year} ${time} ${
      am ? 'AM' : 'PM'
    }`

    // TODO before moving on:
    //  get a UTC string and convert it to timezone?
    //  or confidently make a correct date str?
    //  and/or write the formatted date as a string???
  }

  private parseReceptionTime(text: string) {
    this.checkEvent("parseReceptionTime")
    const [startTimeStr, endTimeStr] = text.split('-')
    if (!endTimeStr) throw "TODO error"; // todo



  }

  private checkEvent(source: string) {
    if (this.currentGigData === null) {
      throw EmailParser.errors.noEventStarted(source);
    }
    return true;
  }

  static errors = {
    couldntFindDate:
      "Should have found a number in the \"date\" cell of an event header, but did not",
    noEventStarted: (source: string) => `Event is null (${source})`,
    datePartsNotSet: (source: string) => new Error(`Date Parts not set (${source})`)
  } as const;
}
