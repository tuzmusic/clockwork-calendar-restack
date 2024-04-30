import EmailGig from "~/data/EmailGig";
import Gig from "~/data/Gig";

const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

function testBasicGigInfo(gig: Gig) {
  it("has a location", () => {
    expect(gig.getLocation()).toEqual("somewhere");
  });

  it("has a start time", () => {
    expect(gig.getStartTime().dateTime).toEqual(start);
  });

  it("has an end time", () => {
    expect(gig.getEndTime().dateTime).toEqual(end);
  });

  it("has an id based on its start date", () => {
    expect(gig.getId()).toEqual("2024-12-01");
  });
}

describe("EmailGig", () => {
  describe("EmailGig.make", () => {
    const gig = EmailGig.make("somewhere", start, end);

    testBasicGigInfo(gig);
  });

  describe("EamilGig.makeFullCalendarGig", () => {
    const basicGig = EmailGig.make("somewhere", start, end);

    const gig = EmailGig.makeFullCalendarGig(basicGig);

    testBasicGigInfo(gig);
  });
});
