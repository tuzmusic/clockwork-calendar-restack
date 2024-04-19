import CalendarGig from "~/data/CalendarGig";
import EmailGig from "~/data/EmailGig";
import Schedule from "~/data/Schedule";
function to2Digits(num: number) {
  return num.toString().padStart(2, "0")
}

function makeStartAndEndStrings(day: number) {
  const start = `2024-12-${to2Digits(day)}T19:00:00-04:00`;
  const end = `2024-12-${to2Digits(day)}T23:00:00-04:00`;
  return [start, end];
}

describe("Schedule", () => {
  describe("Schedule.build", () => {
    it("builds an event set when events match", () => {
      const [start, end] = makeStartAndEndStrings(1)
      const sched = Schedule.build({
        emailGigs: [EmailGig.make("somewhere", start, end)],
        calendarGigs: [CalendarGig.make("somewhere", start, end)]
      });

      const sets = sched.getEventSets();
      expect(sets).toHaveLength(1);
      expect(sets[0].emailGig.getId()).toEqual("2024-12-01");
      expect(sets[0].calendarGig.getId()).toEqual("2024-12-01");
    });

    it("creates a calendar event for a new email event", () => {

    });
  });
});
