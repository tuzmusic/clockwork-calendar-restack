import { GigPart } from "~/data/models/GigParts/GigPart";

export class GigTimeline {
  public getParts() {
    return this.parts;
  }

  private constructor(private parts: GigPart[]) {

  }

  public addPart(part: GigPart) {
    this.parts.push(part);
    this.parts.sort((a, b) =>
      (a.startDateTime > b.startDateTime ? 1 : -1)
    );
  }

  public getStart() {
    if (this.parts.length === 0) {
      throw Error("No parts yet!");
    }

    return this.parts[0].startDateTime;
  }

  public getEnd() {
    const lastPart = this.parts.slice(-1).pop();

    if (!lastPart) {
      throw Error("No parts yet!");
    }

    return lastPart.endDateTime;
  }

  static make(initialParts: GigPart[] = []): GigTimeline {
    if (!initialParts.length) return new GigTimeline([])

    const [firstPart, ...parts] = initialParts
    const timeline = new GigTimeline([firstPart])
    parts.forEach(p => timeline.addPart(p))
    return timeline
  }
}
