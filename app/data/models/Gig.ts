import { EventPart, timeObj, TimeObj } from "~/data/models/types";

export default abstract class Gig {
  protected dateTime: {
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

  public getParts() {
    return this.parts;
  }

  public getId() {
    return this.id;
  }

  public getLocation() {
    return this.location;
  }

  public getStartTime() {
    // todo: parts shouldn't be nullable...
    const parts = this.parts!
    return parts[0].actualStart ?? parts[0].start
  }

  public getEndTime() {
    return this.dateTime.end;
  }
}
