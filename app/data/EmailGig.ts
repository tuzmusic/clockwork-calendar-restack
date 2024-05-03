import CalendarGig from "~/data/CalendarGig";
import DistanceService from "~/data/DistanceService";
import FullCalendarGig from "~/data/FullCalendarGig";
import Gig from "~/data/Gig";
import { EventPart } from "~/data/types";

export default class EmailGig extends Gig {
  static makeWithParts({ location, parts }: {
    parts: EventPart[];
    location: string
  }) {
    const gig = new this(location, parts[0].start.dateTime, parts[0].end.dateTime);
    gig.parts = parts;
    return gig;
  }

  public static make(location: string, startDateTimeStr: string, endDateTimeStr: string) {
    return new this(location, startDateTimeStr, endDateTimeStr);
  }

  static async makeFullCalendarGig(emailGig: EmailGig, distanceService: DistanceService = new DistanceService()) {
    const basicCalendarGig = CalendarGig.makeFromValues(
      emailGig.getLocation(),
      emailGig.getStartTime().dateTime,
      emailGig.getEndTime().dateTime,
      true
    );

    const fullCalendarGig = await FullCalendarGig.makeFromBasicCalendarGig(
      basicCalendarGig, distanceService
    );
    return fullCalendarGig;
  }
}
