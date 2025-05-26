import { mock } from "vitest-mock-extended";

import FullCalendarGig, { FullCalendarGigJson } from "~/data/models/FullCalendarGig";
import GigTitler from "~/data/models/GigTitler";
import { cocktailHourPartJSON, mockReceptionJSONWithActual } from "~/data/models/tests/testConstants";

describe("GigTitler", () => {
  describe("time", () => {
    it.each([
      { expectedStr: "🚙1h", formatted: "1h", minutes: 60 },
      { expectedStr: "🚙2:30", formatted: "2h30m", minutes: 150 }
    ] satisfies {
      expectedStr: string, minutes: number, formatted: string
    }[])("returns $expectedStr if the gig is $formatted from home", ({ expectedStr, minutes, formatted }) => {

      // make a calendar gig
      const gigJson = mock<FullCalendarGigJson>({
        location: "Boston",
        parts: [mockReceptionJSONWithActual, cocktailHourPartJSON],
        distanceInfo: {
          fromHome: {
            miles: 1, minutes: minutes, formattedTime: formatted
          }
        }
      });
      const gig = FullCalendarGig.deserialize(gigJson);
      // make a titler with the gig
      const titler = new GigTitler(gig);
      expect(titler.getTime()).toEqual(expectedStr);
    });
  });

  describe("location", () => {
    it.todo("state");
    it.todo("Boston");
    it.todo("Providence");
    it.todo("Cape Cod");
  });

  describe("Hotel", () => {
    it.todo("hotel");
  });
});
