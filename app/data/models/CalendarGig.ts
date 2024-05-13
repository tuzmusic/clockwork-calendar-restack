import { calendar_v3 } from "googleapis";

import EmailGig from "~/data/models/EmailGig";
import GigWithParts from "~/data/models/GigWithParts";
import { EventPart, TimeObj } from "~/data/models/types";

export default class CalendarGig extends GigWithParts {
  protected readonly _isNew: boolean;
  public get isNew() {
    return this._isNew;
  }

  protected constructor(location: string, startDateTimeStr: string, endDateTimeStr: string, isNew: boolean) {
    super(location, startDateTimeStr, endDateTimeStr);
    this._isNew = isNew;
  }

  public static async makeFromEmailGig(
    emailGig: EmailGig,
  ) {
    const location = emailGig.getLocation();
    const startTime = emailGig.getStartTime().dateTime;
    const endTime = emailGig.getEndTime().dateTime;

    return new CalendarGig(
      location,
      startTime,
      endTime,
      true
    );
  }

  public getStartTime(): TimeObj {
    return this.dateTime.start;
  }

  public static makeFromValues(
    { location, startDateTimeStr, endDateTimeStr, parts, isNew }: {
      location: string,
      startDateTimeStr: string,
      endDateTimeStr: string,
      parts?: EventPart[],
      isNew: boolean
    }
  ) {
    const calendarGig = new this(location, startDateTimeStr, endDateTimeStr, isNew);
    calendarGig.timeline = parts ?? null
    return calendarGig;
  }

  public static makeFromRemoteExisting(googleCalendarObject: calendar_v3.Schema$Event): CalendarGig {
    // todo: test that all-day events throw an error (or are ignored or whatever)

    return CalendarGig.makeFromValues(
      {
        location: googleCalendarObject.location!,
        startDateTimeStr: googleCalendarObject.start!.dateTime!,
        endDateTimeStr: googleCalendarObject.end!.dateTime!,
        isNew: false
      }
    )
  }
}
