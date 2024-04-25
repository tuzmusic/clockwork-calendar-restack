import CalendarGig from "~/data/CalendarGig";
import DistanceService from "~/data/DistanceService";

export default class FullCalendarGig extends CalendarGig {
  protected constructor(location: string, startDateTimeStr: string, endDateTimeStr: string, isNew: boolean) {
    super(location, startDateTimeStr, endDateTimeStr, isNew);
  }

  public static async makeFromBasicCalendarGig(
    basicGig: CalendarGig,
    distanceService = new DistanceService()
  ) {
    const location = basicGig.getLocation();
    const startTime = basicGig.getStartTime().dateTime;
    const endTime = basicGig.getEndTime().dateTime;
    const isNew = basicGig.isNew;

    const newCalendarGig = new CalendarGig(
      location,
      startTime,
      endTime,
      isNew
    );

    return Promise.resolve(newCalendarGig)
  }
}
