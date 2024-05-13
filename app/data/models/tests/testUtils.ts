import { mock } from "vitest-mock-extended";

import GigWithParts from "~/data/models/GigWithParts";
import { conditions } from "~/data/models/tests/conditions.testHelpers";
import DistanceService from "~/data/services/DistanceService";

export function getDistanceServiceWithMocks(location: string) {
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
          return { minutes: 90, formattedTime: "1h 30m", miles: 100 };
        case timeWithWaltham(args):
          return { minutes: 120, formattedTime: "2h", miles: 110 };
        case timeFromWaltham(args):
          return { minutes: 45, formattedTime: "45m" };
        case milesFromBoston(args):
          return { minutes: 70, miles: 65, formattedTime: "1h 10m" };

        default:
          return { minutes: -1, miles: 0, formattedTime: "" };
      }
    })();

    return Promise.resolve({
      ...routeInfo,
      miles: routeInfo.miles ?? 0
    });
  });

  return distanceService;
}

export async function testBasicGigInfo(
  makeGig: (location: string, start: string, end: string) => Promise<GigWithParts>
) {
  const start = "2024-12-01T19:00:00-04:00";
  const end = "2024-12-01T23:00:00-04:00";
  const location = "somewhere";

  const gig = await makeGig(location, start, end);

  it("has a location", () => {
    expect(gig.getLocation()).toEqual(location);
  });

  it("has a start time", () => {
    expect(gig.getStartTime().dateTime).toEqual(start);
  });

  it("has an end time", () => {
    expect(gig.getEndTime().dateTime).toEqual(end);
  });

  it("has an id based on its start date", () => {
    expect(gig.getId()).toEqual("2024-12-01");
  });
}
