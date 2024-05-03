import { calendar_v3 } from "googleapis";

import EmailGig from "~/data/EmailGig";
import Gig from "~/data/Gig";
import { EventPart } from "~/data/types";

export default class CalendarGig extends Gig {
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
    calendarGig.parts = parts ?? null
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
