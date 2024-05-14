import { GigPart } from "~/data/models/GigParts/GigPart";
import { GigTimeline } from "~/data/models/GigParts/GigTimeline";
import SimpleGig from "~/data/models/SimpleGig";

export default abstract class GigWithParts extends SimpleGig {
  protected timeline: GigTimeline;

  protected constructor(protected location: string, parts: GigPart[]) {
    const timeline = GigTimeline.make(parts);
    super(location,  timeline.getStart(), timeline.getEnd())
    this.timeline = timeline
  }

  public getParts() {
    return this.timeline.getParts();
  }

  public getPartsJson() {
    return this.getParts().map(p => p.serialize())
  }

  public serialize() {
    return {
      id: this.id,
      location: this.location,
      parts: this.getPartsJson()
    }
  }
}
