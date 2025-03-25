import { calendar_v3 } from "googleapis";

import GoogleGig from "~/data/models/GoogleGig";
import { end, location, mockDistanceData, mockParts, start } from "~/data/models/tests/testConstants";

describe("GoogleGig.make", () => {
  describe("with no extendedProperties", () => {
    const mockData: calendar_v3.Schema$Event = {
      start: { dateTime: start },
      end: { dateTime: end },
      location,
      id: "abcd"
    };

    const gig = GoogleGig.make(mockData);

    it("returns a simple gig", () => {
      expect(gig.getLocation()).toEqual(location);
      expect(gig.getStartTime()).toEqual(start);
      expect(gig.getEndTime()).toEqual(end);
      expect(gig.getId()).toEqual("2024-12-01");
      expect(gig.getGoogleId()).toEqual("abcd");
    });

    it("has the route info as null", () => {
      expect(gig.getDistanceInfo()).toBeNull();
    });

    it("has the parts as null", () => {
      expect(gig.getPartsJson()).toBeNull();
    });

    it("makes has start and end times", () => {
      expect(gig.getStartTime()).toEqual(start);
      expect(gig.getEndTime()).toEqual(end);
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

      expect(gig.getDistanceInfo()).toEqual(mockDistanceData);
    });
  });

  describe("with parts", () => {
    it("populates the parts from the stored gig " +
      "(though it's not clear what we're going to do with them...)", () => {
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
      expect(gig.getPartsJson()).toEqual(mockParts);
    });
  });

  describe("abbreviated display title", () => {
    it("gives quick info", () => {
      const _someTitles = [
        "Gig 2.5h-ME-H", // time from home / location (state) / hotel
        "Gig 3h-Cape", // time from home / location (area) / (no hotel)
        "Gig 3:45-CT-H", // time from home / location (state) / hotel
        "Gig 1.5h-Bos", // time from home / location (area) / (no hotel)
        "Gig 2.5h-Prov", // time from home / location (area) / (no hotel)
        "Gig 30m-NH" // time from home / location (area) / (no hotel)
      ];


    });

    describe("isCapeCod checks if the gig is in a common city on cape cod", () => {

      function getCityAndState(fullAddress: string): [string, string] {
        // todo test this ont
        const regex = /,\s*([^,]+),\s*([A-Z]{2})\s*\d{5},\s*USA$/;
        const match = fullAddress.match(regex);
        if (!match) {
          throw new Error("Invalid address format");
        }
        return [match[1], match[2]];
      }

      function isCapeCod(fullAddress: string): boolean {
        const [city, state] = getCityAndState(fullAddress);
        if (state !== "MA") return false;
        return [
          "Chatham",
          "Falmouth",
          "Mashpee",
          "Dennis",
          "Brewster",
          "Harwich",
          "Sandwich",
          "Sagamore Beach",
          "Barnstable",
          "Hyannis",
          "Orleans"
        ].includes(city);
      }

      test.each([
        "250 Midland Ave, Montclair, NJ 07042, USA",
        "88 N Spring St, Concord, NH 03301, USA"
      ] as const)("returns false for %s", (fullAddress) => {
        expect(isCapeCod(fullAddress)).toEqual(false);
      });

      test.each([
        "250 Midland Ave, Chatham, MA 07042, USA",
        "88 N Spring St, Mashpee, MA 03301, USA"
      ] as const)("returns false for %s", (fullAddress) => {
        expect(isCapeCod(fullAddress)).toEqual(true);
      });
    });
  });
});
