import CalendarGig from "~/data/CalendarGig";
import DistanceService from "~/data/DistanceService";
import FullCalendarGig from "~/data/FullCalendarGig";
import Gig from "~/data/Gig";

export default class EmailGig extends Gig {
  public static make(location: string, startDateTimeStr: string, endDateTimeStr: string) {
    return new this(location, startDateTimeStr, endDateTimeStr);
  }

   static async makeFullCalendarGig(emailGig: EmailGig, distanceService: DistanceService = new DistanceService()) {
    const basicCalendarGig = CalendarGig.makeFromValues(emailGig.getLocation(),
      emailGig.getStartTime().dateTime,
      emailGig.getEndTime().dateTime
    );

    const fullCalendarGig = FullCalendarGig.makeFromBasicCalendarGig(basicCalendarGig, distanceService)
    return Promise.resolve(fullCalendarGig);
  }
}
