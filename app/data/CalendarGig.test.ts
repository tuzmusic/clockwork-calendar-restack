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
  // make
  describe.each([true, false])("CalendarGig.make (isNew: %s)", (isNew) => {
    const gig = CalendarGig.make(
      "somewhere",
      start,
      end,
      isNew ? { isNew: true } : undefined
    );

    it("has a location", () => {
      expect(gig.getLocation()).toEqual("somewhere");
    });

    it("has a start time", () => {
      expect(gig.getStartTime().dateTime).toEqual(start);
    });

    it("has an start time", () => {
      expect(gig.getEndTime().dateTime).toEqual(end);
    });

    it("has an id based on its start date", () => {
      expect(gig.getId()).toEqual("2024-12-01");
    });

    if (!isNew) {
      it("sets isNew to false by default", () => {
        expect(gig.isNew).toBe(false);
      });
    } else {
      it("can set the isNew flag", () => {
        expect(gig.isNew).toBe(true);
      });
    }
  });

  describe.todo("CalendarGig.makeFromEmailGig");

  // new calendar gig gets distance info
  describe("Creating a brand new CalendarGig from an EmailGig", () => {
    const emailGig = EmailGig.make(location, start, end);

    it("Gets distance info from the Distance Service", () => {
      const distanceService = mock<DistanceService>();
      distanceService.getDistanceInfo.mockResolvedValue({
        distance: 10, duration: dayjs.duration(1, "hour")
      } satisfies DistanceData);

      expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();

      const _newGig = CalendarGig.makeFromEmailGig(emailGig, distanceService);

      expect(distanceService.getDistanceInfo).toHaveBeenCalled();
    });
  });

  // existing event does NOT fetch info

  // storing extended props (for new gig only, right?)

  // updating from changed email event
});
