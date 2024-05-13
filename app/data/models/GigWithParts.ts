import { GigPart } from "~/data/models/GigParts/GigPart";
import { GigTimeline } from "~/data/models/GigParts/GigTimeline";

export default abstract class GigWithParts {
  private readonly id: string;
  protected timeline: GigTimeline;

  protected constructor(protected location: string, parts: GigPart[]) {
    this.timeline = GigTimeline.make(parts);
    this.id = this.timeline.getStart().split("T")[0];
  }

  public getParts() {
    return this.timeline.getParts();
  }

  public getId() {
    return this.id;
  }

  public getLocation() {
    return this.location;
  }

  public getStartTime() {
    return this.timeline.getStart();
  }

  public getEndTime() {
    return this.timeline.getEnd();
  }
}
