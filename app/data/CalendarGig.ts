import Gig from "~/data/Gig";

export default class CalendarGig extends Gig {
  public static make(location: string, startDateTimeStr: string, endDateTimeStr: string) {
    return new this(location, startDateTimeStr, endDateTimeStr);
  }
}
