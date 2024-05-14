import { mock } from "vitest-mock-extended";

import EmailGig from "~/data/models/EmailGig";
import FullCalendarGig from "~/data/models/FullCalendarGig";
import { GigPartJSON } from "~/data/models/GigParts/GigPart";
import {
  cocktailEnd,
  cocktailHourPart,
  cocktailStart,
  location,
  receptionEnd,
  receptionPart,
  receptionStart
} from "~/data/models/tests/testConstants";
import DistanceService from "~/data/services/DistanceService";

const cocktailJson: GigPartJSON = {
  type: "cocktail hour",
  startDateTime: cocktailStart,
  actualStartDateTime: cocktailStart,
  endDateTime: cocktailEnd,
  actualEndDateTime: cocktailEnd
};
const receptionJson: GigPartJSON = {
  type: "reception",
  startDateTime: receptionStart,
  actualStartDateTime: receptionStart,
  endDateTime: receptionEnd,
  actualEndDateTime: receptionEnd
};

describe("serializers", () => {
  describe("EmailGig#serialize", () => {
    it("returns the json", () => {
      const gig = EmailGig.make(location, [cocktailHourPart, receptionPart]);
      expect(gig.serialize()).toEqual({
        location,
        id: receptionStart.split("T").shift(),
        parts: [
          {
            type: "cocktail hour",
            startDateTime: cocktailStart,
            actualStartDateTime: cocktailStart,
            endDateTime: cocktailEnd,
            actualEndDateTime: cocktailEnd
          },
          {
            type: "reception",
            startDateTime: receptionStart,
            actualStartDateTime: receptionStart,
            endDateTime: receptionEnd,
            actualEndDateTime: receptionEnd
          }
        ] satisfies GigPartJSON[]
      });
    });
  });
  describe("FullCalendarGig#serialize", () => {
    it("returns the json", () => {
      const gig = FullCalendarGig.make({
        location,
        parts: [cocktailHourPart, receptionPart],
        distanceService: mock<DistanceService>(),
        isNew: true
      });

      expect(gig.serialize()).toEqual({
        location,

        id: receptionStart.split("T").shift(),
        parts: [
          cocktailJson,
          receptionJson
        ] satisfies GigPartJSON[]
      });
    });
  });
});
