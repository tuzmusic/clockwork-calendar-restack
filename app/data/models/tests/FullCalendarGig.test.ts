import { mock } from "vitest-mock-extended";

import { TIME_ZONE } from "~/data/models/constants";
import FullCalendarGig from "~/data/models/FullCalendarGig";
import GoogleGig from "~/data/models/GoogleGig";
import { getDistanceServiceWithMocks } from "~/data/models/tests/testUtils";
import { DistanceData, timeObj } from "~/data/models/types";
import CalendarService from "~/data/services/CalendarService";
import DistanceService from "~/data/services/DistanceService";

const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("FullCalendarGig.make", () => {
  const basicGig = GoogleGig.make({
    location: location,
    start: timeObj(start),
    end: timeObj(end)
  });

  describe("distance info", () => {
    test("It gets distance info from the Distance Service", async () => {
      const distanceService = mock<DistanceService>();
      distanceService.getDistanceInfo.mockResolvedValue({
        miles: 10, minutes: 60, formattedTime: "1h"
      } satisfies DistanceData);

      const fullGig = FullCalendarGig.makeFromValues({
        location: basicGig.getLocation(),
        parts: basicGig.getParts(),
        distanceService
      });

      expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
      expect(fullGig.getId()).toEqual(basicGig.getId());

      await fullGig.fetchRouteInfo();
      expect(distanceService.getDistanceInfo).toHaveBeenCalled();
    });

    const it = test.extend<{ routeInfo: Record<string, DistanceData> }>({
      routeInfo: async ({ task: _ }, use) => {
        const distanceService = getDistanceServiceWithMocks(location);

        const newGig = FullCalendarGig.makeFromValues({
          location: basicGig.getLocation(),
          parts: basicGig.getParts(),
          distanceService
        });

        await newGig.fetchRouteInfo();
        const routeInfo = newGig.getRouteInfo();
        if (!routeInfo) {
          throw Error("Fetched route info but it is null");
        }
        return await use(routeInfo);
      }
    });

    describe("Gets the correct distance info", () => {
      it("withWaltham", ({ routeInfo }) => {
        expect(routeInfo.withWaltham).toEqual({
          miles: expect.any(Number),
          minutes: 120,
          formattedTime: "2h"
        });
      });

      it("fromHome", ({ routeInfo }) => {
        expect(routeInfo.fromHome).toEqual({
          miles: expect.any(Number),
          minutes: 90,
          formattedTime: "1h 30m"
        });
      });

      it("fromWaltham", ({ routeInfo }) => {
        expect(routeInfo.fromWaltham).toEqual({
          miles: expect.any(Number),
          minutes: 45,
          formattedTime: "45m"
        });
      });

      it("walthamDetour", ({ routeInfo }) => {
        expect(routeInfo.walthamDetour).toEqual({
          miles: 10,
          minutes: 30,
          formattedTime: "30m"
        });
      });

      it("fromBoston", ({ routeInfo }) => {
        expect(routeInfo.fromBoston).toEqual({
          miles: 65,
          minutes: 70,
          formattedTime: "1h 10m"
        });
      });
    });

    describe("Saving the event", () => {
      const calendarService = mock<CalendarService>();
      calendarService.post.mockResolvedValue("ok");

      const testCall = async (gig: FullCalendarGig) => {
        vi.resetAllMocks();
        await gig.store(calendarService);
        return calendarService.post.mock.calls[0]?.[0];
      };

      it("includes the location in the payload as extendedProperties", async ({ gig }) => {
        expect(await testCall(gig)).toMatchObject({ location });
      });

      it("includes the startTime the payload as extendedProperties", async ({ gig }) => {
        expect(await testCall(gig)).toMatchObject({ start: { dateTime: start, timeZone: TIME_ZONE } });
      });

      it("includes the endTime the payload as extendedProperties", async ({ gig }) => {
        expect(await testCall(gig)).toMatchObject({ end: { dateTime: end, timeZone: TIME_ZONE } });
      });

      it("includes the route info in the payload as extendedProperties", async ({ gig }) => {
        const call = await testCall(gig);
        const distanceInfoStr = call.extendedProperties!.private!.distanceInfo!;
        expect(distanceInfoStr.length).toBeLessThanOrEqual(1024);

        const distanceInfo = JSON.parse(distanceInfoStr);
        expect(distanceInfo).toMatchObject({
          withWaltham: expect.objectContaining({
            miles: expect.any(Number),
            minutes: expect.any(Number),
            formattedTime: expect.any(String)
          })
        });
      });
    });
  });

  // storing extended props (for new gig only, right?)
  describe.todo("Event Parts");

});
