import { mock, mockDeep } from "vitest-mock-extended";

import CalendarGig from "~/data/CalendarGig";
import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import FullCalendarGig from "~/data/FullCalendarGig";
import Schedule from "~/data/Schedule";
import { DistanceData } from "~/data/types";

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
      async function getEventSet() {
        const [start, end] = makeStartAndEndDateTimes({ dayNumber: 2 });
        const distanceService = mock<DistanceService>();
        distanceService.getDistanceInfo.mockResolvedValue({
          miles: 10, minutes: 60, formattedTime: "1h"
        } satisfies DistanceData);
        const sched = Schedule.build({
          emailGigs: [EmailGig.make("somewhere", start, end)],
          remoteGigs: []
        }, distanceService);

        const [set, ...sets] = await sched.getEventSets();
        expect(sets).toHaveLength(0);
        return set;
      }

      describe("basic gig info", () => {

        it("creates a new calendar event for a new email event with basic id info)", async () => {
          const set = await getEventSet();
          expect(set.emailGig.getId()).toEqual("2024-12-02");
          expect(set.calendarGig.getId()).toEqual("2024-12-02");
          expect(set.calendarGig.isNew).toBe(true);
        });
      });

      describe("full gig info", () => {
        it("is a FullCalendarGig", async () => {
          const set = await getEventSet();
          expect(set.remoteGig).instanceof(FullCalendarGig)
        });
        it.todo("has route info");
      });
    });

    describe.todo("Email event whose matching remote calendar event is BASIC");
    describe.todo("Email event whose matching remote calendar event has FULL INFORMATION");
    describe.todo("Remote calendar event with BASIC info, with no matching email event");
    describe.todo("Remote calendar event with FULL info, with no matching email event");

    it("builds an event set when events match", async () => {
      const [start, end] = makeStartAndEndDateTimes({ dayNumber: 1 });
      const sched = Schedule.build({
        emailGigs: [EmailGig.make("somewhere", start, end)],
        remoteGigs: [CalendarGig.makeFromValues("somewhere", start, end)]
      });

      const [set, ...sets] = await sched.getEventSets();
      expect(sets).toHaveLength(0);

      expect(set.emailGig.getId()).toEqual("2024-12-01");
      expect(set.remoteGig.getId()).toEqual("2024-12-01");
      expect(set.remoteGig.isNew).toBe(false);
    });


    it.todo("orphaned calendar events (nowhere near urgent)");
  });
});
