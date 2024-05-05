import { mock } from "vitest-mock-extended";

import CalendarGig from "~/data/models/CalendarGig";
import EmailGig from "~/data/models/EmailGig";
import FullCalendarGig from "~/data/models/FullCalendarGig";
import Schedule from "~/data/models/Schedule";
import { mockParts } from "~/data/models/tests/testConstants";
import { getDistanceServiceWithMocks } from "~/data/models/tests/testUtils";
import { DistanceData } from "~/data/models/types";
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
    describe("Email event with no matching remote calendar event (aka NEW EVENT)", () => {
      // todo: test.extend
      async function getTestEventSet() {
        const distanceService = mock<DistanceService>();
        distanceService.getDistanceInfo.mockResolvedValue({
          miles: 10, minutes: 60, formattedTime: "1h"
        } satisfies DistanceData);
        const sched = Schedule.build({
          emailGigs: [EmailGig.makeWithParts({ location: "somewhere", parts: mockParts })],
          remoteGigs: []
        }, distanceService);

        const [set, ...sets] = await sched.getEventSets();
        expect(sets).toHaveLength(0);
        return set;
      }

      describe("basic gig info", () => {

        it("creates a new calendar event for a new email event with basic id info)", async () => {
          const set = await getTestEventSet();
          expect(set.emailGig.getId()).toEqual("2024-12-01");
          expect(set.calendarGig.getId()).toEqual("2024-12-01");
          expect(set.calendarGig.isNew).toBe(true);
        });
      });

      describe("full gig info", () => {
        it("is a FullCalendarGig", async () => {
          const set = await getTestEventSet();
          expect(set.calendarGig).instanceof(FullCalendarGig);
        });

        // this should be covered in more unit-level tests for
        //  FullCalendarGig.makeFromBasicCalendarGig
        //  and EmailGig.makeFullCalendarGig
        it.todo("has route info");
      });
    });

    describe.todo("Email event whose matching remote calendar event is BASIC");
    describe.todo("Email event whose matching remote calendar event has FULL INFORMATION");
    describe.todo("Remote calendar event with BASIC info, with no matching email event");
    describe.todo("Remote calendar event with FULL info, with no matching email event");

    it("builds an event set when events match", async () => {
      const [start, end] = makeStartAndEndDateTimes({ dayNumber: 1 });
      const location = "somewhere";
      const distanceService = getDistanceServiceWithMocks(location);
      const sched = Schedule.build({
          emailGigs: [EmailGig.makeWithParts({ location, parts: mockParts })],
          remoteGigs: [CalendarGig.makeFromValues({
            location: location,
            startDateTimeStr: start,
            endDateTimeStr: end,
            isNew: false
          })]
        },
        distanceService
      );

      const [set, ...sets] = await sched.getEventSets();
      expect(sets).toHaveLength(0);

      expect(set.emailGig.getId()).toEqual("2024-12-01");
      expect(set.remoteGig.getId()).toEqual("2024-12-01");
      expect(set.remoteGig.isNew).toBe(false);
    });


    it.todo("orphaned calendar events (nowhere near urgent)");
  });
});
