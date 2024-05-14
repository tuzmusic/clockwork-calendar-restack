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
import { DistanceData } from "~/data/models/types";
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
    it("returns the json", async () => {
      const mockDistanceService = mock<DistanceService>();
      mockDistanceService.getDistanceInfo.mockResolvedValue(
        { minutes: 90, formattedTime: "1h 30m", miles: 100 }
      );

      const anyMiles = {
        miles: expect.any(Number),
        minutes: expect.any(Number),
        formattedTime: expect.any(String)
      } satisfies DistanceData;

      const gig = FullCalendarGig.make({
        location,
        parts: [cocktailHourPart, receptionPart],
        distanceService: mockDistanceService,
        isNew: true
      });

      await gig.fetchDistanceInfo()

      expect(gig.serialize()).toEqual({
        location,
        distanceInfo: {
          fromHome: anyMiles,
          withWaltham: anyMiles,
          walthamDetour: anyMiles,
          fromWaltham: anyMiles,
          fromBoston: anyMiles
        },
        id: receptionStart.split("T").shift(),
        parts: [
          cocktailJson,
          receptionJson
        ] satisfies GigPartJSON[]
      });
    });
  });
});
