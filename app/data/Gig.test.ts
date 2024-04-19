import Gig from "~/data/Gig";

describe("Gig abstract class", () => {
  const start = "2024-12-01T19:00:00-04:00";
  const end = "2024-12-01T23:00:00-04:00";

  class GigImpl extends Gig {
    public static make(location: string, startDateTimeStr: string, endDateTimeStr: string) {
      return new this(location, startDateTimeStr, endDateTimeStr);
    }
  }

  describe("public data", () => {
    const gig = GigImpl.make("somewhere", start, end);

    it("has a location", () => {
      expect(gig.getLocation()).toEqual("somewhere");
    });

    it("has a start time", () => {
      expect(gig.getStartTime().dateTime).toEqual(start)
    });

    it("has an start time", () => {
      expect(gig.getEndTime().dateTime).toEqual(end)
    });

    it("has an id based on its start date", () => {
      expect(gig.getId()).toEqual('2024-12-01')
    });
  });
});

describe("EmailGig", () => {

});
