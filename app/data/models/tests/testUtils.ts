import { mock } from "vitest-mock-extended";

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
    const distanceInfo = (() => {
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
      ...distanceInfo,
      miles: distanceInfo.miles ?? 0
    });
  });

  return distanceService;
}
