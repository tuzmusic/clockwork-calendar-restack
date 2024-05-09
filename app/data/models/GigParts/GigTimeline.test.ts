import { CocktailHour } from "~/data/models/GigParts/CocktailHour";
import { GigTimeline } from "~/data/models/GigParts/GigTimeline";
import { Reception } from "~/data/models/GigParts/Reception";
import { end, start } from "~/data/models/tests/testConstants";

describe("GigTimeline", () => {
  it("can be initialized empty", () => {
    expect(GigTimeline.make().getParts()).toEqual([]);
  });

  it("can be initialized with a single part", () => {
    const part = new Reception(start, end);
    expect(GigTimeline.make(part).getParts()).toEqual([part]);
  });

  it("can add a new part, preserving chronological order", () => {
    const laterTime = "2024-12-01T19:00:00-04:00";
    const earlierTime = "2024-12-01T18:00:00-04:00";
    const finalTime = "2024-12-01T21:00:00-04:00";

    const timeline = GigTimeline.make(new Reception(laterTime, finalTime));

    timeline.addPart(
      new CocktailHour(earlierTime, laterTime)
    );

    expect(timeline.getParts()[0].type).toEqual('cocktail hour')
  });

  it("returns the start time of the first part as the timeline start", () => {
    const laterTime = "2024-12-01T19:00:00-04:00";
    const earlierTime = "2024-12-01T18:00:00-04:00";
    const finalTime = "2024-12-01T21:00:00-04:00";

    const timeline = GigTimeline.make(new Reception(laterTime, finalTime));

    timeline.addPart(
      new CocktailHour(earlierTime, laterTime)
    );

    expect(timeline.getStart()).toEqual(earlierTime)
  });

  it("returns the end time of the first part as the timeline end", () => {
    const laterTime = "2024-12-01T19:00:00-04:00";
    const earlierTime = "2024-12-01T18:00:00-04:00";
    const finalTime = "2024-12-01T21:00:00-04:00";

    const timeline = GigTimeline.make(new Reception(laterTime, finalTime));

    timeline.addPart(
      new CocktailHour(earlierTime, laterTime)
    );

    expect(timeline.getEnd()).toEqual(finalTime)
  });
});
