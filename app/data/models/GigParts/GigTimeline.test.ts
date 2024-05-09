import { GigPart } from "~/data/models/GigParts/GigPart";
import { Reception } from "~/data/models/GigParts/Reception";
import { end, start } from "~/data/models/tests/testConstants";

class GigTimeline {

  public getParts() {
    return this.parts
  }

  private constructor(private parts: GigPart[]) {

  }

  static make(initialPart?: GigPart): GigTimeline {
    return new GigTimeline(initialPart ? [initialPart] : []);
  }
}

describe("GigTimeline", () => {
  it("can be initialized empty", () => {
    expect(GigTimeline.make().getParts()).toEqual([])
  });

  it("can be initialized with a single part", () => {
    const part = new Reception(start, end);
    expect(GigTimeline.make(part).getParts()).toEqual([part])
  });
});
