import EmailGig from "~/data/EmailGig";
import { getDistanceServiceWithMocks, testBasicGigInfo } from "~/data/testUtils";

describe("EmailGig", () => {
  describe("EmailGig.make", () => {
    testBasicGigInfo(
      (location, start, end) => Promise.resolve(EmailGig.make(location, start, end))
    );
  });

  describe("EmailGig.makeFullCalendarGig", () => {
    testBasicGigInfo(
      (location, start, end) =>
        EmailGig.makeFullCalendarGig(
          EmailGig.make(location, start, end),
          getDistanceServiceWithMocks(location)
        )
    );
  });
});
