import { timeObj, TimeObj } from "~/data/types";

export default abstract class Gig {
  private dateTime: {
    start: TimeObj, end: TimeObj
  };

  protected constructor(private location: string, startDateTimeStr: string, endDateTimeStr: string) {
    this.dateTime = {
      start: timeObj(startDateTimeStr),
      end: timeObj(endDateTimeStr)
    }
  }

  public getLocation() {
    return this.location;
  }

  // CalendarGig will override this to use the parts
  // Or will EmailGig do parts as well?
  public getStartTime() {
    return this.dateTime.start;
  }

  public getEndTime() {
    return this.dateTime.end;
  }
}
