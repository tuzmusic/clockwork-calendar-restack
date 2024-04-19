import { timeObj, TimeObj } from "~/data/types";

export default abstract class Gig {
  private dateTime: {
    start: TimeObj, end: TimeObj
  };

  private id: string

  protected constructor(private location: string, startDateTimeStr: string, endDateTimeStr: string) {
    this.dateTime = {
      start: timeObj(startDateTimeStr),
      end: timeObj(endDateTimeStr)
    }

    this.id = startDateTimeStr.split('T')[0]
  }

  public getId() {
    return this.id
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
