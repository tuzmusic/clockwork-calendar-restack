import { mock } from "vitest-mock-extended";

import CalendarGig from "~/data/CalendarGig";
import CalendarService from "~/data/CalendarService";
import { TIME_ZONE } from "~/data/constants";
import DistanceService from "~/data/DistanceService";
import FullCalendarGig from "~/data/FullCalendarGig";
import { getDistanceServiceWithMocks } from "~/data/tests/testUtils";
import { DistanceData } from "~/data/types";

const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("FullCalendarGig.make", () => {
  const basicGig = CalendarGig.makeFromValues(location, start, end);

  describe("distance info", () => {
    test("It gets distance info from the Distance Service", async () => {
      const distanceService = mock<DistanceService>();
      distanceService.getDistanceInfo.mockResolvedValue({
        miles: 10, minutes: 60, formattedTime: "1h"
      } satisfies DistanceData);

      expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();

      const fullGig = await FullCalendarGig.makeFromBasicCalendarGig(basicGig, distanceService);

      expect(fullGig.getId()).toEqual(basicGig.getId());

      expect(distanceService.getDistanceInfo).toHaveBeenCalled();
    });

    const it = test.extend<{ gig: FullCalendarGig }>({
      gig: async ({ task: _ }, use) => {
        const distanceService = getDistanceServiceWithMocks(location);

        const newGig = await FullCalendarGig.makeFromBasicCalendarGig(basicGig, distanceService);
        return await use(newGig);
      }
    });

    describe("Gets the correct distance info", () => {
      it("withWaltham", ({ gig }) => {
        expect(gig.getRouteInfo().withWaltham).toEqual({
          miles: expect.any(Number),
          minutes: 120,
          formattedTime: "2h"
        });
      });

      it("fromHome", ({ gig }) => {
        expect(gig.getRouteInfo().fromHome).toEqual({
          miles: expect.any(Number),
          minutes: 90,
          formattedTime: "1h 30m"
        });
      });

      it("fromWaltham", ({ gig }) => {
        expect(gig.getRouteInfo().fromWaltham).toEqual({
          miles: expect.any(Number),
          minutes: 45,
          formattedTime: "45m"
        });
      });

      it("walthamDetour", ({ gig }) => {
        expect(gig.getRouteInfo().walthamDetour).toEqual({
          miles: 10,
          minutes: 30,
          formattedTime: "30m"
        });
      });

      it("fromBoston", ({ gig }) => {
        expect(gig.getRouteInfo().fromBoston).toEqual({
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
        expect(distanceInfoStr.length).toBeLessThanOrEqual(1024)

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
