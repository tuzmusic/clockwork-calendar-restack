import CalendarGig from "~/data/CalendarGig";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";

describe("CalendarGig", () => {
  // make
  describe("CalendarGig.make", () => {
    const gig = CalendarGig.make("somewhere", start, end);

    it("has a location", () => {
      expect(gig.getLocation()).toEqual("somewhere");
    });

    it("has a start time", () => {
      expect(gig.getStartTime().dateTime).toEqual(start);
    });

    it("has an start time", () => {
      expect(gig.getEndTime().dateTime).toEqual(end);
    });

    it("has an id based on its start date", () => {
      expect(gig.getId()).toEqual("2024-12-01");
    });
  });

  // makeFromEmailGig

  // new calendar gig gets distance info

  // storing extended props (for new gig only, right?)

  // updating from changed email event
});
