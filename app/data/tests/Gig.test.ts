import { mockParts } from "~/data/EventRow/testConstants";
import Gig from "~/data/Gig";
import { EventPart } from "~/data/types";

const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("Gig abstract class", () => {
  class GigImpl extends Gig {
    public static make(location: string, startDateTimeStr: string, endDateTimeStr: string) {
      return new this(location, startDateTimeStr, endDateTimeStr);
    }

    public setParts(parts: EventPart[]) {
      this.parts = parts;
    }
  }

  describe("public data", () => {
    const gig = GigImpl.make("somewhere", start, end);

    it("has a location", () => {
      expect(gig.getLocation()).toEqual("somewhere");
    });

    it("has parts", () => {
      gig.setParts(mockParts)
    });

    it("has a start time that is the start time of its first part", () => {
      expect(gig.getStartTime().dateTime).toEqual(start);
    });

    it("has an start time", () => {
      expect(gig.getEndTime().dateTime).toEqual(end);
    });

    it("has an id based on its start date", () => {
      expect(gig.getId()).toEqual("2024-12-01");
    });
  });
});

