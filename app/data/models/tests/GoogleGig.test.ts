import { calendar_v3 } from "googleapis";

import { GigPartJSON } from "~/data/models/GigParts/GigPart";
import GoogleGig from "~/data/models/GoogleGig";
import { end, location, mockDistanceData, mockParts, start } from "~/data/models/tests/testConstants";

describe("GoogleGig.make", () => {
  describe("with no extendedProperties", () => {
    const mockData: calendar_v3.Schema$Event = {
      start: { dateTime: start },
      end: { dateTime: end },
      location
    };

    const gig = GoogleGig.make(mockData);

    it("returns a simple gig", () => {
      expect(gig.getLocation()).toEqual(location);
      expect(gig.getStartTime()).toEqual(start);
      expect(gig.getEndTime()).toEqual(end);
      expect(gig.getId()).toEqual("2024-12-01");
    });

    it("has the route info as null", () => {
      expect(gig.getRouteInfo()).toBeNull();
    });

    it("makes a reception with the start and end times", () => {
      const [part] = gig.getParts();
      expect(part.type).toEqual("reception");
      expect(part.startDateTime).toEqual(start);
      expect(part.endDateTime).toEqual(end);
    });
  });

  describe("with route info", () => {
    it("populates the route info from the stored gig", () => {
      const mockData: calendar_v3.Schema$Event = {
        start: { dateTime: start },
        end: { dateTime: end },
        location,
        extendedProperties: {
          private: {
            distanceInfo: JSON.stringify(mockDistanceData)
          }
        }
      };

      const gig = GoogleGig.make(mockData);

      expect(gig.getRouteInfo()).toEqual(mockDistanceData);
    });
  });

  describe("with parts", () => {
    it("populates the parts from the stored gig", () => {
      const mockData: calendar_v3.Schema$Event = {
        start: { dateTime: start },
        end: { dateTime: end },
        location,
        extendedProperties: {
          private: {
            parts: JSON.stringify(mockParts)
          }
        }
      };

      const gig = GoogleGig.make(mockData);

      const actualJson = gig.getParts().map(p => p.serialize());
      const mockPartsFullJson = mockParts.map(p => ({
        ...p,
        actualStartDateTime: p.startDateTime,
        actualEndDateTime: p.endDateTime
      } satisfies GigPartJSON));

      expect(actualJson).toEqual(mockPartsFullJson);
    });
  });
});
