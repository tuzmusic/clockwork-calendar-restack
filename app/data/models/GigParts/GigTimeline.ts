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
    if (this.parts.length === 0) {
      throw Error("No parts yet!");
    }

    return this.parts.slice(-1).pop()?.endDateTime;
  }

  static make(initialPart?: GigPart): GigTimeline {
    return new GigTimeline(initialPart ? [initialPart] : []);
  }
}
