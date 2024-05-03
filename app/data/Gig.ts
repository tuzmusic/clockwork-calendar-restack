import { EventPart, timeObj, TimeObj } from "~/data/types";

export default abstract class Gig {
  private dateTime: {
    start: TimeObj, end: TimeObj
  };

  private readonly id: string;
  protected parts: EventPart[] = [];

  protected constructor(protected location: string, startDateTimeStr: string, endDateTimeStr: string) {
    this.dateTime = {
      start: timeObj(startDateTimeStr),
      end: timeObj(endDateTimeStr)
    };

    this.id = startDateTimeStr.split("T")[0];
  }

  // todo: this should probably be moved to the static make function
  public setParts(parts: EventPart[]) {
    this.parts = parts
  }

  public getParts() {
    return this.parts;
  }

  public getId() {
    return this.id;
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
