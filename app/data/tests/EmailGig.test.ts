import EmailGig from "~/data/EmailGig";
import FullCalendarGig from "~/data/FullCalendarGig";
import { getDistanceServiceWithMocks, testBasicGigInfo } from "~/data/tests/testUtils";

const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";
const location = "somewhere";


describe("EmailGig", () => {
  describe("EmailGig.make", () => {
    testBasicGigInfo(
      (location, start, end) => Promise.resolve(EmailGig.make(location, start, end))
    );
  });

  // todo: this probably should be an instance method?
  describe("EmailGig.makeFullCalendarGig", () => {
    const distanceService = getDistanceServiceWithMocks(location);

    afterEach(() => {
      distanceService.getDistanceInfo.mockReset();
    });

    const it = test.extend<{ gig: FullCalendarGig }>({
      gig: async ({ task: _ }, use) => {
        const gig = await EmailGig.makeFullCalendarGig(
          EmailGig.make(location, start, end),
          distanceService
        );
        return await use(gig);
      }
    });

    it("creates the basic gig", async ({ gig }) => {
      expect(gig.getLocation()).toEqual(location);
      expect(gig.getStartTime().dateTime).toEqual(start);
      expect(gig.getEndTime().dateTime).toEqual(end);
      expect(gig.getId()).toEqual("2024-12-01");
    });
  });
});
