import { mock } from "vitest-mock-extended";

import CalendarGig from "~/data/CalendarGig";
import { conditions } from "~/data/conditions.testHelpers";
import DistanceService from "~/data/DistanceService";
import FullCalendarGig from "~/data/FullCalendarGig";
import { DistanceData } from "~/data/types";
const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";
describe("FullCalendarGig.make", () => {
  const basicGig = CalendarGig.makeFromValues(location, start, end);

  it("Gets distance info from the Distance Service", async () => {
    const distanceService = mock<DistanceService>();
    distanceService.getDistanceInfo.mockResolvedValue({
      miles: 10, minutes: 60, formattedTime: "1h"
    } satisfies DistanceData);

    expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();

    const fullGig = await FullCalendarGig.makeFromBasicCalendarGig(basicGig, distanceService)

    expect(fullGig.getId()).toEqual(basicGig.getId());

    expect(distanceService.getDistanceInfo).toHaveBeenCalled();
  });

  describe("Gets the correct distance info", () => {
    // mock various returns (like in the old repo)

    const it = test.extend<{ routeInfo: Record<string, DistanceData> }>({
      routeInfo: async ({ task: _ }, use) => {
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
              default:
                return { minutes: -1, formattedTime: "" };
            }
          })();

          return Promise.resolve({
            miles: milesFromBoston(args) ? 70 : 0,
            ...routeInfo
          });
        });

        const newGig = await FullCalendarGig.makeFromBasicCalendarGig(basicGig, distanceService);
        return await use(newGig.getRouteInfo());
      }
    });

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
        miles: expect.any(Number),
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
    // assert that we've stored the distances we care about
    // (this includes designing the structure of the extended props)
  });

});
