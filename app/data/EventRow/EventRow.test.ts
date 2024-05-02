import { calendar_v3 } from "googleapis";
import { mock } from "vitest-mock-extended";

import EmailGig from "~/data/EmailGig";
import EventRow from "~/data/EventRow/EventRow";
import GoogleGig from "~/data/EventRow/GoogleGig";

const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("EventRow", () => {
  describe("EventRow.buildRow", () => {
    describe("Email gig, incomplete calendar gig", () => {
      describe("basic info matches", () => {

        const emailGig = EmailGig.make(location, start, end);
        const simpleCalendarGig = GoogleGig.make(
          mock<calendar_v3.Schema$Event>({
            start: { dateTime: start },
            end: { dateTime: end },
            location
          })
        );

        const row = EventRow.buildRow(emailGig, simpleCalendarGig)

        expect(row.appGig).instanceof(EventRow)
      });
    });
  });
});
