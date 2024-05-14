import EmailGig from "~/data/models/EmailGig";
import { GigPartJSON } from "~/data/models/GigParts/GigPart";
import {
  cocktailHourPart,
  cocktailStart,
  location,
  receptionEnd,
  receptionPart,
  receptionStart
} from "~/data/models/tests/testConstants";

describe("serializers", () => {
  describe("EmailGig#serialize", () => {
    it("returns the json", () => {
      const gig = EmailGig.make(location, [cocktailHourPart, receptionPart]);
      expect(gig.serialize()).toEqual({
        location,
        id: receptionStart.split('T').shift(),
        parts: [
          {
            type: 'cocktail hour',
            startDateTime: cocktailStart,
            actualStartDateTime: cocktailStart,
            endDateTime: receptionStart,
            actualEndDateTime: receptionStart
          },
          {
            type: 'reception',
            startDateTime: receptionStart,
            actualStartDateTime: receptionStart,
            endDateTime: receptionEnd,
            actualEndDateTime: receptionEnd
          }
        ] satisfies GigPartJSON[]
      })
    });
  });
});
