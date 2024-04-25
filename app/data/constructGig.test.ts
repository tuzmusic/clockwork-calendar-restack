import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { calendar_v3 } from "googleapis";
import { mock } from "vitest-mock-extended";

import CalendarGig from "~/data/CalendarGig";


dayjs.extend(duration);
const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("Constructing the 'middle gig' (nothing about comparison yet)", () => {
  describe("An email gig with a matching calendar gig", () => {
    describe("Existing calendar gig is incomplete", () => {

      const it = test.extend<{ gig: CalendarGig }>({
        gig: async ({ task: _ }, use) => {
          const mockData = mock<calendar_v3.Schema$Event>();
          const calendarGig = await CalendarGig.makeFromRemoteExisting(mockData);
          return await use(calendarGig);
        }
      });

      it("is not new", ({ gig }) => expect(gig.isNew).toEqual(false));
      it("has the correct location", ({ gig }) => expect(gig.getLocation()).toEqual(location));
      it("has the correct start time", ({ gig }) => expect(gig.getStartTime().dateTime).toEqual(start));
      it("has the correct end time", ({ gig }) => expect(gig.getEndTime().dateTime).toEqual(end));

      /**
       * - make a Gig from google
       *   - START WITH ONE PROP (timeFromHome)
       *   - In a SEPARATE function that DOESN'T KNOW ABOUT GOOGLE,
       *     - make a new Gig (or do it with this gig) and set the missing info
       */
    });

    describe.todo("Existing calendar gig is already complete", () => {

    });
  });
});
