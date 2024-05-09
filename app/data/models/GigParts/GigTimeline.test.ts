import { CocktailHour } from "~/data/models/GigParts/CocktailHour";
import { GigTimeline } from "~/data/models/GigParts/GigTimeline";
import { Reception } from "~/data/models/GigParts/Reception";

const laterTime = "2024-12-01T19:00:00-04:00";
const earlierTime = "2024-12-01T18:00:00-04:00";
const finalTime = "2024-12-01T21:00:00-04:00";

const reception = new Reception(laterTime, finalTime);
const cocktailHour = new CocktailHour(earlierTime, laterTime);
describe("GigTimeline", () => {
  it("can be initialized empty", () => {
    expect(GigTimeline.make().getParts()).toEqual([]);
  });

  it("can be initialized with a single part", () => {
    expect(GigTimeline.make([reception]).getParts()).toEqual([reception]);
  });

  it("can be initialized with parts, and they are stored in chronological order", () => {
    const timeline = GigTimeline.make([reception, cocktailHour]);
    expect(timeline.getParts()[0].type).toEqual("cocktail hour");
    expect(timeline.getParts()[1].type).toEqual("reception");
  });

  it("can add a new part, preserving chronological order", () => {
    const timeline = GigTimeline.make([new Reception(laterTime, finalTime)]);
    timeline.addPart(cocktailHour);
    expect(timeline.getParts()[0].type).toEqual("cocktail hour");
  });

  it("returns the start time of the first part as the timeline start", () => {
    const timeline = GigTimeline.make([new Reception(laterTime, finalTime)]);
    timeline.addPart(cocktailHour);
    expect(timeline.getStart()).toEqual(earlierTime);
  });

  it("returns the end time of the first part as the timeline end", () => {
    const timeline = GigTimeline.make([new Reception(laterTime, finalTime)]);
    timeline.addPart(cocktailHour);
    expect(timeline.getEnd()).toEqual(finalTime);
  });
});
