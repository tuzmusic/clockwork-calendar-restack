import { calendar_v3 } from "googleapis";

import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import Gig from "~/data/Gig";

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
    location: string,
    startDateTimeStr: string,
    endDateTimeStr: string
  ) {
    return new this(location, startDateTimeStr, endDateTimeStr, false);
  }

  public static makeFromRemoteExisting(googleCalendarObject: calendar_v3.Schema$Event): CalendarGig {
    // todo: test that all-day events throw an error (or are ignored or whatever)

    return CalendarGig.makeFromValues(
      googleCalendarObject.location!,
      googleCalendarObject.start!.dateTime!,
      googleCalendarObject.end!.dateTime!,
    )
  }
}
