import { calendar_v3 } from "googleapis";
import { mock } from "vitest-mock-extended";

import EmailGig from "~/data/EmailGig";
import EventRow from "~/data/EventRow/EventRow";
import GoogleGig from "~/data/EventRow/GoogleGig";
import FullCalendarGig from "~/data/FullCalendarGig";
import { getDistanceServiceWithMocks } from "~/data/tests/testUtils";

const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";
const distanceService = getDistanceServiceWithMocks(location);

describe("EventRow", () => {
  describe("EventRow.buildRow", () => {
    describe("Email gig, incomplete calendar gig", () => {
      describe("appGig, when basic info matches between the email and calendar gig", () => {
        const it = test.extend<{ row: EventRow }>({
          row: async ({ task: _ }, use) => {
            const mockData = mock<calendar_v3.Schema$Event>({
              start: { dateTime: start },
              end: { dateTime: end },
              location
            });
            const emailGig = EmailGig.make(location, start, end);
            const simpleCalendarGig = GoogleGig.make(mockData);

            const row = EventRow.buildRow(emailGig, simpleCalendarGig, distanceService);
            expect(row).instanceof(EventRow);
            return await use(row);
          }
        });

        it("is a FullCalendarGig", ({ row: { appGig } }) => {
          expect(appGig).instanceof(FullCalendarGig);
        });

        it("has basic info that matches the email gig", ({ row: { appGig } }) => {
          expect(appGig.getLocation()).toEqual(location);
          expect(appGig.getStartTime().dateTime).toEqual(start);
          expect(appGig.getEndTime().dateTime).toEqual(end);
          expect(appGig.getId()).toEqual("2024-12-01");
        });

        it("starts with no route info", ({ row: { appGig } }) => {
          expect(appGig.getRouteInfo()).toBeNull();
        });

        it("can fill out the route info on demand", ({ row: { appGig } }) => {

        });
      });
    });
  });
});
