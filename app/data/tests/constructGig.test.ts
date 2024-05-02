import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { calendar_v3 } from "googleapis";
import { mock } from "vitest-mock-extended";

import CalendarGig from "~/data/CalendarGig";
import { DistanceData, EventPart, timeObj } from "~/data/types";


dayjs.extend(duration);
const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("Constructing the 'middle gig' (nothing about comparison yet)", () => {
  describe("An email gig with a matching calendar gig", () => {
    describe("Existing calendar gig is incomplete", () => {

      const it = test.extend<{ gig: CalendarGig }>({
        gig: async ({ task: _ }, use) => {
          const mockData = mock<calendar_v3.Schema$Event>({
            start: { dateTime: start },
            end: { dateTime: end },
            location
          });
          const calendarGig = CalendarGig.makeFromRemoteExisting(mockData);
          return await use(calendarGig);
        }
      });

      it("is not new (already existing!)", ({ gig }) => {
        expect(gig.isNew).toEqual(false);
      });

      it("has the correct location", ({ gig }) => {
        expect(gig.getLocation()).toEqual(location);
      });

      it("has the correct start time", ({ gig }) => {
        expect(gig.getStartTime().dateTime).toEqual(start);
      });

      it("has the correct end time", ({ gig }) => {
        expect(gig.getEndTime().dateTime).toEqual(end);
      });

      it("has an id based on its start date", ({ gig }) => {
        expect(gig.getId()).toEqual("2024-12-01");
      });
    });

    describe("Existing calendar gig is already complete", () => {
      const it = test.extend<{ gig: CalendarGig }>({
        gig: async ({ task: _ }, use) => {
          const mockData = mock<calendar_v3.Schema$Event>({
            start: timeObj(start),
            end: timeObj(end),
            location,
            extendedProperties: {
              private: {
                distanceInfo: JSON.stringify({
                  fromHome: mock<DistanceData>(),
                  withWaltham: mock<DistanceData>(),
                  walthamDetour: mock<DistanceData>(),
                  fromWaltham: mock<DistanceData>(),
                  fromBoston: mock<DistanceData>()
                } satisfies Record<string, DistanceData>),
                parts: JSON.stringify([
                  {
                    type: "reception",
                    start: timeObj(start),
                    end: timeObj(end)
                  }
                ] satisfies EventPart[])
              }
            }
          });
          const calendarGig = CalendarGig.makeFromRemoteExisting(mockData);
          return await use(calendarGig);
        }
      });

      it("has the parts", ({ gig }) => {
        expect(gig.getParts()).toHaveLength(1)
      });
    });
  });
});
