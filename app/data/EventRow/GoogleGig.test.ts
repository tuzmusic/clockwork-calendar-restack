import { calendar_v3 } from "googleapis";

import GoogleGig from "~/data/EventRow/GoogleGig";
import { end, location, mockDistanceData, mockPart, start } from "~/data/EventRow/testConstants";

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
      expect(gig.getStartTime().dateTime).toEqual(start);
      expect(gig.getEndTime().dateTime).toEqual(end);
      expect(gig.getId()).toEqual("2024-12-01");
    });

    it("has the extendedProperties as null", () => {
      expect(gig.getRouteInfo()).toBeNull();
      expect(gig.getEventParts()).toBeNull();
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
            parts: JSON.stringify([mockPart])
          }
        }
      };

      const gig = GoogleGig.make(mockData);
      expect(gig.getParts()).toEqual([mockData]);
    });
  });
});
