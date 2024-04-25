import { calendar_v3 } from "googleapis";
import { mock } from "vitest-mock-extended";

import CalendarGig from "~/data/CalendarGig";
import CalendarService from "~/data/CalendarService";
import { conditions } from "~/data/conditions.testHelpers";
import { TIME_ZONE } from "~/data/constants";
import DistanceService from "~/data/DistanceService";
import FullCalendarGig from "~/data/FullCalendarGig";
import { DistanceData } from "~/data/types";

const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("FullCalendarGig.make", () => {
  const basicGig = CalendarGig.makeFromValues(location, start, end);

  describe("distance info", () => {
    it("Gets distance info from the Distance Service", async () => {
      const distanceService = mock<DistanceService>();
      distanceService.getDistanceInfo.mockResolvedValue({
        miles: 10, minutes: 60, formattedTime: "1h"
      } satisfies DistanceData);

      expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();

      const fullGig = await FullCalendarGig.makeFromBasicCalendarGig(basicGig, distanceService);

      expect(fullGig.getId()).toEqual(basicGig.getId());

      expect(distanceService.getDistanceInfo).toHaveBeenCalled();
    });

    const testWithGig = test.extend<{ gig: FullCalendarGig }>({
      gig: async ({ task: _ }, use) => {
        const {
          timeWithWaltham,
          timeFromWaltham,
          timeFromHome,
          milesFromBoston
        } = conditions(location);

        const distanceService = mock<DistanceService>();
        distanceService.getDistanceInfo.mockImplementation((args) => {
          const routeInfo = (() => {
            switch (true) {
              case timeFromHome(args):
                return { minutes: 90, formattedTime: "1h 30m" };
              case timeWithWaltham(args):
                return { minutes: 120, formattedTime: "2h" };
              case timeFromWaltham(args):
                return { minutes: 45, formattedTime: "45m" };
              case milesFromBoston(args):
                return { minutes: 70, miles: 65, formattedTime: '1h 10m' };

              default:
                return { minutes: -1, miles: 0, formattedTime: "" };
            }
          })();

          return Promise.resolve({
            ...routeInfo,
            miles: routeInfo.miles ?? 0
          });
        });

        const newGig = await FullCalendarGig.makeFromBasicCalendarGig(basicGig, distanceService);
        return await use(newGig);
      }
    });

    describe("Gets the correct distance info", () => {
      testWithGig("withWaltham", ({ gig }) => {
        expect(gig.getRouteInfo().withWaltham).toEqual({
          miles: expect.any(Number),
          minutes: 120,
          formattedTime: "2h"
        });
      });

      testWithGig("fromHome", ({ gig }) => {
        expect(gig.getRouteInfo().fromHome).toEqual({
          miles: expect.any(Number),
          minutes: 90,
          formattedTime: "1h 30m"
        });
      });

      testWithGig("fromWaltham", ({ gig }) => {
        expect(gig.getRouteInfo().fromWaltham).toEqual({
          miles: expect.any(Number),
          minutes: 45,
          formattedTime: "45m"
        });
      });

      testWithGig.todo("walthamDetour", ({ gig }) => {
        expect(gig.getRouteInfo().walthamDetour).toEqual({
          miles: expect.any(Number),
          minutes: 30,
          formattedTime: "30m"
        });
      });

      testWithGig("fromBoston", ({ gig }) => {
        expect(gig.getRouteInfo().fromBoston).toEqual({
          miles: 65,
          minutes: 70,
          formattedTime: "1h 10m"
        });
      });
      // assert that we've stored the distances we care about
      // (this includes designing the structure of the extended props)
    });

    describe("Saving the event", () => {
      const calendarService = mock<CalendarService>();
      calendarService.post.mockResolvedValue("ok");

      const testCall = async (gig: FullCalendarGig, args: calendar_v3.Schema$Event) => {
        await gig.store(calendarService);
        expect(calendarService.post).toHaveBeenCalledWith(expect.objectContaining(args));
      };

      testWithGig("includes the location in the payload as extendedProperties", ({ gig }) => {
        testCall(gig, { location });
      });

      testWithGig("includes the startTime the payload as extendedProperties", ({ gig }) => {
        testCall(gig, { start: { dateTime: start, timeZone: TIME_ZONE } });
      });

      testWithGig("includes the endTime the payload as extendedProperties", ({ gig }) => {
        testCall(gig, { end: { dateTime: end, timeZone: TIME_ZONE } });
      });

      testWithGig.todo("includes the route info in the payload as extendedProperties", ({ gig }) => {
        testCall(gig, {
          extendedProperties: expect.objectContaining({
            // withWaltham
            // fromHome
          })
        });
      });
    });
  });

  // storing extended props (for new gig only, right?)
  describe.todo("Event Parts");

});
