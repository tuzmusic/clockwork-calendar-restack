import { mock } from "vitest-mock-extended";

import EmailGig from "~/data/models/EmailGig";
import GoogleGig from "~/data/models/GoogleGig";
import Schedule from "~/data/models/Schedule";
import { end, location, mockParts, start } from "~/data/models/tests/testConstants";
import DistanceService from "~/data/services/DistanceService";

function to2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

function makeStartAndEndDateTimes({ dayNumber }: { dayNumber: number }) {
  const start = `2024-12-${to2Digits(dayNumber)}T19:00:00-04:00`;
  const end = `2024-12-${to2Digits(dayNumber)}T23:00:00-04:00`;
  return [start, end];
}

describe("Schedule", () => {
  describe("Schedule.build", () => {
    it("matches an email event with a google event", () => {
      const emailGig = EmailGig.makeWithParts({ location: "somewhere", parts: mockParts });
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

      const rows = schedule.getEventSets()

      expect(rows).toHaveLength(1)
    });

    it("handles a new email event (with no matching google event", () => {
      const emailGig = EmailGig.makeWithParts({ location: "somewhere", parts: mockParts });

      const schedule = Schedule.build({
          emailGigs: [emailGig],
          remoteGigs: []
        },
        mock<DistanceService>()
      );

      const rows = schedule.getEventSets()

      expect(rows).toHaveLength(1)
      expect(rows[0].getCalendarGig()).toBeUndefined()
    });

    it.todo("orphaned calendar events (nowhere near urgent)");
  });
});
