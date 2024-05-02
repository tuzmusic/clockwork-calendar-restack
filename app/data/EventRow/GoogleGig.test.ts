import { calendar_v3 } from "googleapis";
import { mock } from "vitest-mock-extended";

import GoogleGig from "~/data/EventRow/GoogleGig";
import { DistanceData } from "~/data/types";

const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("GoogleGig.make", () => {
  describe("with no extendedProperties", () => {
    const mockData = mock<calendar_v3.Schema$Event>({
      start: { dateTime: start },
      end: { dateTime: end },
      location
    });

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
    const mockDistanceData = {
      fromHome: { miles: 1, minutes: 10, formattedTime: "10m" },
      withWaltham: { miles: 2, minutes: 20, formattedTime: "20m" },
      walthamDetour: { miles: 3, minutes: 30, formattedTime: "30m" },
      fromWaltham: { miles: 4, minutes: 40, formattedTime: "40m" },
      fromBoston: { miles: 5, minutes: 50, formattedTime: "0mm" }
    } satisfies Record<string, DistanceData>;

    const mockData = mock<calendar_v3.Schema$Event>({
      start: { dateTime: start },
      end: { dateTime: end },
      location,
      extendedProperties: {
        private: {
          distanceInfo: JSON.stringify(mockDistanceData)
        }
      }
    });

    const gig = GoogleGig.make(mockData);

    it("populates the route info from the stored gig", () => {
      expect(gig.getRouteInfo()).toEqual(mockDistanceData);
    });
  });
});
