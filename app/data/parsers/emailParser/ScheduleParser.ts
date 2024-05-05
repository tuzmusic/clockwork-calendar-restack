import type { Cheerio, Element } from "cheerio";
import * as cheerio from "cheerio";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import {
  EVENT_CELLS_COUNT,
  FIRST_MONTH_ROW_INDEX,
  getTextFromLines,
  getTimesFromOtherPartText,
  rowsFromFetchedEmailBody,
  setStartTimeFromOtherPartTimeString,
  userFirstName
} from "~/data/parsers/emailParser/helpers-and-constants";

import { isMonth, Month } from ",/Month";

dayjs.extend(timezone)
dayjs.extend(utc)
// dayjs.tz.setDefault("America/New_York")

export class ScheduleParser {
  public events: Event[] = []

  constructor(private readonly html: string) {}

  private readonly current = {
    month: '' as Month | '',
    year: 0,
    event: null as Event | null,
  }

  static errors = {
    couldntFindDate:
      'Should have found a number in the "date" cell of an event header, but did not',
    noEventStarted: (source: string) => `Event is null (${source})`,
  } as const

  private checkEvent(source: string) {
    if (this.current.event === null) {
      throw ScheduleParser.errors.noEventStarted(source)
    }
  }

  private parseCeremony(text: string) {
    if (!text.includes(userFirstName)) return
    const { event } = this.current
    if (!event) throw ScheduleParser.errors.noEventStarted('parseCeremony')

    event.hasCeremony = true
    event.descriptionLines.push(getTextFromLines(text))

    /* SIMPLE START TIME */
    setStartTimeFromOtherPartTimeString(event, text)
    // ceremony listed start time is the actual start time, but we start playing 30m before
    event.startTime = event.startTime.subtract(30, 'm')

    /* PARTS */
    const [startTimeStr, endTimeStr] = getTimesFromOtherPartText(text)
    const { dateTime, timeZone } = event.makeGoogleDateFromTime(startTimeStr)
    const writtenStartDay = dayjs(dateTime).tz(timeZone)
    const actualStartDay = writtenStartDay.subtract(30, 'minutes')

    event.addPart({
      type: 'ceremony',
      actualStart: {
        dateTime: actualStartDay.format(),
        timeZone: 'America/New_York',
      },
      start: event.makeGoogleDateFromTime(startTimeStr),
      end: event.makeGoogleDateFromTime(endTimeStr),
    })
  }

  private parseCocktailHour(text: string) {
    if (!text.includes(userFirstName)) return
    const { event } = this.current
    if (!event) throw ScheduleParser.errors.noEventStarted('parseCocktailHour')

    event.hasCocktails = true
    event.descriptionLines.push(getTextFromLines(text))

    /* PARTS */
    const [startTimeStr, endTimeStr] = getTimesFromOtherPartText(text)
    event.addPart({
      type: 'cocktail hour',
      start: event.makeGoogleDateFromTime(startTimeStr),
      end: event.makeGoogleDateFromTime(endTimeStr),
    })

    /* SIMPLE START TIME */
    // if we're already playing the ceremony then the start times don't matter
    if (event.hasCeremony) return
    setStartTimeFromOtherPartTimeString(event, text)
  }

  // If a row is a month header, sets the current month and year.
  // Returns whether the row is a month header
  private parseMonthHeader(row: Cheerio<Element>) {
    if (row.children().length !== 1) return false
    const [month, yearStr] = row
      .text()
      .split(', ')
      .map((s) => s.trim())
    if (!yearStr || !isMonth(month)) return false
    const year = Number(yearStr)
    if (!year) return false
    this.current.month = month
    this.current.year = year
    return true
  }

  private parseMainInfo(row: Cheerio<Element>) {
    const tds = row.children('td')
    if (tds.length !== EVENT_CELLS_COUNT) return false

    // todo: i THINK these two if statements are related
    //  but the logic is a bit too much for me at the moment
    //  (see existing error inside "case 3")
    //  (also this first if case logic might be wrong)
    if (this.current.event === null && this.events.length) {
      throw 'Reached a new event and expected a completed event, but no "current" Event found'
    }

    // we've reached a new event, so add the current event
    if (this.current.event) {
      this.events.push(this.current.event)
      this.current.event = null
    }

    this.current.event = new Event()
    const { event } = this.current
    event.title = 'Clockwork Gig'

    event.isNew = !!row.html()?.includes('FF0000')

    const [DATE, TIME, LOCATION] = [1, 3, 4] // td indices
    tds.each((tdIndex, el) => {
      const text = cheerio.load(el)('td').text().trim()
      switch (tdIndex) {
        case 0:
        case 2:
          break
        case DATE: {
          this.parseDate(text)
          break
        }
        case TIME: {
          this.parseTime(text)
          break
        }
        case LOCATION:
          this.parseLocation(text)
          break
      }
    })
    return true
  }

  private parseLocation(text: string) {
    if (!this.current.event)
      throw ScheduleParser.errors.noEventStarted('parseDate')

    this.current.event.location =
      text
        .split(/\s\s+/) // split by large blocks of space (remove "CEC" leader)
        .filter(Boolean) // remove in-between spaces
        .pop()
        ?.trim() ?? 'COULD NOT PARSE LOCATION' // get last element
  }

  private parseTime(text: string) {
    const { event } = this.current

    if (!event) {
      throw ScheduleParser.errors.noEventStarted('case TIME')
    }

    const [startTimeStr, endTimeStr] = text.split('-')

    if (!endTimeStr) {
      throw 'TODO error' // todo
    }

    const key = ['date', 'month', 'year'] satisfies (keyof (typeof event)['dateParts'])[]
    if (key.some((s) => !event.dateParts[s])) {
      throw new Error('Date/Month/Year unset')
    }

    event.startTime = event.getDateTimeFromString(startTimeStr)
    event.endTime = event.getDateTimeFromString(endTimeStr)

    event.addPart({
      type: 'reception',
      start: event.makeGoogleDateFromTime(startTimeStr),
      end: event.makeGoogleDateFromTime(endTimeStr),
    })
  }

  private parseDate(text: string) {
    if (!this.current.event)
      throw ScheduleParser.errors.noEventStarted('parseDate')

    const date = Number(text)
    if (!date) throw ScheduleParser.errors.couldntFindDate

    this.current.event.dateParts.date = date
    this.current.event.dateParts.month = this.current.month
    this.current.event.dateParts.year = this.current.year
  }

  private parseOtherInfo(row: Cheerio<Element>) {
    this.checkEvent('parseOtherInfo')

    const rowText = row.text().trim()
    if (rowText.startsWith('Ceremony')) {
      this.parseCeremony(rowText)
      return true
    } else if (rowText.startsWith('Cocktail')) {
      this.parseCocktailHour(rowText)
      return true
    }
    return false
  }

  public parse() {
    const $ = cheerio.load(this.html)
    const allScheduleRows = rowsFromFetchedEmailBody($)

    allScheduleRows.each((rowIndex, el) => {
      if (rowIndex < FIRST_MONTH_ROW_INDEX) return true
      const row = $(el)

      if (this.parseMonthHeader(row)) return true
      if (this.parseMainInfo(row)) return true
      if (this.current.event && this.parseOtherInfo(row)) return true
    })

    // add the last event (since the loop adds at the start)
    if (this.current.event) {
      this.events.push(this.current.event)
    }

    return this.events
  }
}

/*
cheerio.load(this.html)('body > div > div > table:nth-of-type(2)').find('tr:nth-child(3) table table > tbody > tr')
* */
