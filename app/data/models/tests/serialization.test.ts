import EmailGig from "~/data/models/EmailGig";
import { GigPartJSON } from "~/data/models/GigParts/GigPart";
import {
  cocktailHourPart,
  earlierTime,
  finalTime,
  laterTime,
  location,
  receptionPart
} from "~/data/models/tests/testConstants";

describe("serializers", () => {
  describe("EmailGig#serialize", () => {
    it("returns the json", () => {
      const gig = EmailGig.make(location, [cocktailHourPart, receptionPart]);
      expect(gig.serialize()).toEqual({
        location,
        id: laterTime.split('T').shift(),
        parts: [
          {
            type: 'cocktail hour',
            startDateTime: earlierTime,
            actualStartDateTime: earlierTime,
            endDateTime: laterTime,
            actualEndDateTime: laterTime
          },
          {
            type: 'reception',
            startDateTime: laterTime,
            actualStartDateTime: laterTime,
            endDateTime: finalTime,
            actualEndDateTime: finalTime
          }
        ] satisfies GigPartJSON[]
      })
    });
  });
});
