import { CocktailHour } from "~/data/models/GigParts/CocktailHour";
import { GigPart } from "~/data/models/GigParts/GigPart";
import { Reception } from "~/data/models/GigParts/Reception";
import GigWithParts from "~/data/models/GigWithParts";

const laterTime = "2024-12-01T19:00:00-04:00";
const earlierTime = "2024-12-01T18:00:00-04:00";
const finalTime = "2024-12-01T21:00:00-04:00";

const reception = new Reception(laterTime, finalTime);
const cocktailHour = new CocktailHour(earlierTime, laterTime);

describe("GigWithParts abstract class", () => {
  class GigImpl extends GigWithParts {
    public static make(location: string, parts: GigPart[]) {
      return new this(location, parts);
    }
  }

  describe("public data", () => {
    const gig = GigImpl.make("somewhere", [cocktailHour, reception]);

    it("has a location", () => {
      expect(gig.getLocation()).toEqual("somewhere");
    });

    it("has parts", () => {
      expect(gig.getParts()).toEqual(expect.arrayContaining([cocktailHour, reception]))
    });

    it("has a start time that is the start time of its first part", () => {
      expect(gig.getStartTime()).toEqual(earlierTime);
    });

    it("has an end time that is the end time of its last part", () => {
      expect(gig.getEndTime()).toEqual(finalTime);
    });

    it("has an id based on its start date", () => {
      expect(gig.getId()).toEqual("2024-12-01");
    });
  });
});

