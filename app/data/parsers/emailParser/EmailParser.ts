import type { Cheerio, Element } from "cheerio";
import * as cheerio from "cheerio";

import DayJsTz from "~/data/models/DayJsTz";
import EmailGig from "~/data/models/EmailGig";
import { EventPart, timeObj } from "~/data/models/types";
import DateTime from "~/data/parsers/emailParser/DateTime";
import {
  EVENT_CELLS_COUNT,
  FIRST_MONTH_ROW_INDEX,
  getTimesFromOtherPartText,
  userFirstName
} from "~/data/parsers/emailParser/helpers-and-constants";
import { isMonth, Month } from "~/data/parsers/emailParser/Month";

interface InProcessGigData {
  dateParts?: {
    date: number, month: Month, year: number
  } | undefined,
  location?: string | undefined,
  parts: EventPart[]
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
    // add the last event (since the loop adds at the start)
    if (this.currentGigData) {
      this.addGigToList();
    }
  }

  private currentDateMarker!: {
    month: Month,
    year: number
  };

  public currentGigData: InProcessGigData | null = null;

  private parseRow(param: { atIndex: number; el: Element }) {
    const { atIndex: rowIndex, el } = param;
    if (rowIndex < FIRST_MONTH_ROW_INDEX) return;
    const row = this.$(el);

    if (this.isRowMonthDivider(row)) return;
    if (this.parseMonthHeader(row)) return;

    // we can't add the gig after parseAdd'lParts because if there are
    // no add'l parts we'll miss adding the gig.
    // and then it's cludgy to add from parseGig if we don't know
    // whether there are add'l parts
    if (this.parseGig(row)) return;
    if (this.parseAdditionalParts(row)) return;
  }

  private addGigToList() {
    // todo: I don't like these exclamation points.
    this.gigs.push(EmailGig.make({
      parts: this.currentGigData!.parts!,
      location: this.currentGigData!.location!
    }));
  }

  private isRowMonthDivider(row: Cheerio<Element>) {
    return row.text().includes("___________");
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

    this.currentDateMarker = { month, year };
    return true;
  }

  private parseGig(row: Cheerio<Element>) {
    const tds = row.children("td");
    if (tds.length !== EVENT_CELLS_COUNT) return false;

    /* TODO: previously pushed the completed event when finding a new event
    *   We *probably* want to do this here, but it feels like it belongs elsewhere,
    *   So hold off for now
    * */
    if (this.currentGigData) this.addGigToList();
    this.resetGig();

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

    return true;
  }

  private parseDate(text: string) {
    this.checkEvent("parseDate");

    const date = Number(text);
    if (!date) throw EmailParser.errors.couldntFindDate;

    const { month, year } = this.currentDateMarker;
    this.currentGigData!.dateParts = {
      date, year, month
    };
  }

  private parseReceptionTime(text: string) {
    this.checkEvent("parseReceptionTime");
    const [startTimeStr, endTimeStr] = text.split("-");
    if (!endTimeStr) throw "TODO error"; // todo

    this.currentGigData!.parts = [{
      type: "reception",
      start: this.makeDate(startTimeStr),
      end: this.makeDate(endTimeStr)
    }];
  }

  private makeDate(s: string) {
    this.checkEvent("makeDate");
    if (!this.currentGigData!.dateParts) {
      throw EmailParser.errors.datePartsNotSet("makeDate");
    }

    return DateTime.makeGoogleDateFromTime(s, this.currentGigData!.dateParts!);
  }

  private parseLocation(text: string) {
    this.checkEvent("parseLocation");

    this.currentGigData!.location =
      text
        .split(/\s\s+/) // split by large blocks of space (remove "CEC" leader)
        .filter(Boolean) // remove in-between spaces
        .pop()
        ?.trim() ?? "COULD NOT PARSE LOCATION";
  }

  private parseAdditionalParts(row: Cheerio<Element>) {
    this.checkEvent("parseAdditionalParts");

    const rowText = row.text().trim();
    if (rowText.startsWith("Ceremony")) {
      this.parseCeremony(rowText);
      return true;
    } else if (rowText.startsWith("Cocktail")) {
      this.parseCocktailHour(rowText);
      return true;
    }
    return false;
  }

  private parseCeremony(text: string) {
    if (!text.includes(userFirstName)) return;
    this.checkEvent("parseCeremony");

    const [startTimeStr, endTimeStr] = getTimesFromOtherPartText(text);
    const { dateTime } = this.makeDate(startTimeStr);
    const writtenStartDay = DayJsTz(dateTime)
    const actualStartDay = writtenStartDay.subtract(30, "minutes");

    const ceremony: EventPart = {
      type: "ceremony",
      actualStart: timeObj(actualStartDay.format()),
      start: this.makeDate(startTimeStr),
      end: this.makeDate(endTimeStr)
    };
    this.addPartAndSort(ceremony);
  }

  private addPartAndSort(part: EventPart) {
    this.currentGigData?.parts?.push(part);
    this.currentGigData?.parts?.sort((a, b) =>
      (a.start.dateTime > b.start.dateTime ? 1 : -1)
    );
  }

  private parseCocktailHour(text: string) {
    if (!text.includes(userFirstName)) return;
    this.checkEvent("parseCocktailHour");

    const [startTimeStr, endTimeStr] = getTimesFromOtherPartText(text);
    const cocktailHourPart: EventPart = {
      type: "cocktail hour",
      start: this.makeDate(startTimeStr),
      end: this.makeDate(endTimeStr)
    };

    this.addPartAndSort(cocktailHourPart);
  }

  private checkEvent(source: string): asserts this is this & { currentGigData: InProcessGigData } {
    if (this.currentGigData === null) {
      throw EmailParser.errors.noEventStarted(source);
    }
  }

  static errors = {
    couldntFindDate:
      "Should have found a number in the \"date\" cell of an event header, but did not",
    noEventStarted: (source: string) => `Event is null (${source})`,
    datePartsNotSet: (source: string) => new Error(`Date Parts not set (${source})`)
  } as const;

  private resetGig() {
    this.currentGigData = {
      parts: []
    };
  }
}
