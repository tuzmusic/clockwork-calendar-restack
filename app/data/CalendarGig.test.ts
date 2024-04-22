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
  describe("CalendarGig.makeFromExisting", () => {
    const gig = CalendarGig.makeFromExisting(location, start, end);

    it("has a location", () => {
      expect(gig.getLocation()).toEqual(location);
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

    it("is marked as not new", () => {
      expect(gig.isNew).toBe(false);
    });

    describe.todo("getting the info from the existing event");
  });

  describe("Creating a brand new CalendarGig from an EmailGig (.makeFromEmailGig)", () => {
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

    // storing extended props (for new gig only, right?)
    it.todo("Get the correct distance info", () => {
      // mock various returns (like in the old repo)

      // assert that we've stored the distances we care about
      // (this includes designing the structure of the extended props)
    });

    describe.todo('Event Parts')
  });


  // updating from changed email event
});
