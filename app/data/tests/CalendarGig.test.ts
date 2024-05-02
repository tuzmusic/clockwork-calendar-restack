import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { mock } from "vitest-mock-extended";

import CalendarGig from "~/data/CalendarGig";
import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import { DistanceData } from "~/data/types";

dayjs.extend(duration);

const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("CalendarGig", () => {
  // todo: these tests can probably be deleted in favor of EmailGig.makeFullCalendarGig
  describe.todo("Creating a brand new CalendarGig from an EmailGig (.makeFromEmailGig)", () => {
    const emailGig = EmailGig.make(location, start, end);

    // making from email gig should return a FullCalendarGig
    // so this is vaguely relevant. best would probably be
    // to check the gig's type with instanceOf.
    // leaving for now
    it.todo("Gets distance info from the Distance Service", () => {
      const distanceService = mock<DistanceService>();
      distanceService.getDistanceInfo.mockResolvedValue({
        miles: 10, minutes: 60, formattedTime: "1h"
      } satisfies DistanceData);

      expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();

      const _newGig = CalendarGig.makeFromEmailGig(emailGig);

      expect(distanceService.getDistanceInfo).toHaveBeenCalled();
    });
  });


  // updating from changed email event
});
