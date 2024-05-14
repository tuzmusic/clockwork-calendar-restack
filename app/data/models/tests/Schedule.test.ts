import { mock } from "vitest-mock-extended";

import EmailGig from "~/data/models/EmailGig";
import GoogleGig from "~/data/models/GoogleGig";
import Schedule from "~/data/models/Schedule";
import { end, location, receptionPart, start } from "~/data/models/tests/testConstants";
import DistanceService from "~/data/services/DistanceService";

describe("Schedule", () => {
  describe("Schedule.build", () => {
    it("matches an email event with a google event", () => {
      const emailGig = EmailGig.make(location, [receptionPart]);
      const remoteGig = GoogleGig.make({
        start: { dateTime: start },
        end: { dateTime: end },
        location
      });

      // sanity check
      expect(emailGig.getId()).toEqual(remoteGig.getId());

      const schedule = Schedule.build({
          emailGigs: [emailGig],
          remoteGigs: [remoteGig]
        },
        mock<DistanceService>()
      );

      const rows = schedule.eventSets

      expect(rows).toHaveLength(1)
    });

    it("handles a new email event (with no matching google event", () => {
      const emailGig = EmailGig.make(location, [receptionPart]);

      const schedule = Schedule.build({
          emailGigs: [emailGig],
          remoteGigs: []
        },
        mock<DistanceService>()
      );

      const rows = schedule.eventSets

      expect(rows).toHaveLength(1)
      expect(rows[0].getCalendarGig()).toBeUndefined()
    });

    it.todo("orphaned calendar events (nowhere near urgent)");
  });
});
