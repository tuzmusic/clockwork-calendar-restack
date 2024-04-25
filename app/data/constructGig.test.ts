import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import CalendarGig from "~/data/CalendarGig";

dayjs.extend(duration);
const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe.todo("Constructing the 'middle gig' (nothing about comparison yet)", () => {
  describe.todo("An email gig with a matching calendar gig", () => {
    describe.todo("Existing calendar gig is incomplete", async () => {
      const newGigFromIncompleteCalendarGig = await CalendarGig.makeFromRemoteExisting();

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
