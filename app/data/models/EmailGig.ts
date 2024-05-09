import CalendarGig from "~/data/models/CalendarGig";
import FullCalendarGig from "~/data/models/FullCalendarGig";
import Gig from "~/data/models/Gig";
import { EventPart } from "~/data/models/types";
import DistanceService from "~/data/services/DistanceService";

export default class EmailGig extends Gig {
  static makeWithParts({ location, parts }: {
    parts: EventPart[];
    location: string
  }) {
    const gig = new this(location, parts[0].start.dateTime, parts[0].end.dateTime);
    gig.timeline = parts;
    return gig;
  }

  public static make(location: string, startDateTimeStr: string, endDateTimeStr: string) {
    return new this(location, startDateTimeStr, endDateTimeStr);
  }

  static async makeFullCalendarGig(emailGig: EmailGig, distanceService: DistanceService = new DistanceService()) {
    const basicCalendarGig = CalendarGig.makeFromValues(
      {
        location: emailGig.getLocation(),
        startDateTimeStr: emailGig.getStartTime().dateTime,
        endDateTimeStr: emailGig.getEndTime().dateTime,
        isNew: true
      }
    );

    const fullCalendarGig = await FullCalendarGig.makeFromBasicCalendarGig(
      basicCalendarGig, distanceService
    );
    return fullCalendarGig;
  }
}
