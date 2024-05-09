import { TIME_ZONE } from "~/data/models/constants";
import DayJsTz from "~/data/models/DayJsTz";
import { GigPart } from "~/data/models/GigPart";
import { end, start } from "~/data/models/tests/testConstants";

class GigPartImpl extends GigPart {
}

class Reception extends GigPart {
  constructor(startDateTime: string, endDateTime: string) {
    super("reception", startDateTime, endDateTime);
  }
}

class CocktailHour extends GigPart {
  constructor(startDateTime: string, endDateTime: string) {
    super("cocktail hour", startDateTime, endDateTime);
  }
}

class Ceremony extends GigPart {
  constructor(startDateTime: string, endDateTime: string) {
    super("ceremony", startDateTime, endDateTime);
    const writtenStartDay = DayJsTz(startDateTime).tz(TIME_ZONE)
    const actualStartDay = writtenStartDay.subtract(30, 'minutes')
    this.actualStart = actualStartDay.tz(TIME_ZONE).format()
  }
}

describe("GigPart", () => {
  describe("base class", () => {
    const part = new GigPartImpl("reception", start, end);
    test("type", () => expect(part.type).toEqual("reception"));
    test("start", () => expect(part.startDateTime).toEqual(start));
    test("end", () => expect(part.endDateTime).toEqual(end));
    test("actualStart is equal to the start", () => expect(part.actualStart).toEqual(start));
    test("actualEnd is equal to the end", () => expect(part.actualEnd).toEqual(end));
  });

  describe("Reception", () => {
    const part = new Reception(start, end);
    test("type", () => expect(part.type).toEqual("reception"));
    test("start", () => expect(part.startDateTime).toEqual(start));
    test("end", () => expect(part.endDateTime).toEqual(end));
    test("actualStart is equal to the start", () => expect(part.actualStart).toEqual(start));
    test("actualEnd is equal to the end", () => expect(part.actualEnd).toEqual(end));
  });

  describe("Cocktail Hour", () => {
    const part = new CocktailHour(start, end);
    test("type", () => expect(part.type).toEqual("cocktail hour"));
    test("start", () => expect(part.startDateTime).toEqual(start));
    test("end", () => expect(part.endDateTime).toEqual(end));
    test("actualStart is equal to the start", () => expect(part.actualStart).toEqual(start));
    test("actualEnd is equal to the end", () => expect(part.actualEnd).toEqual(end));
  });

  describe("Ceremony", () => {
    const part = new Ceremony("2024-06-01T23:00:00Z", end);
    test("type", () => expect(part.type).toEqual("ceremony"));
    test("start", () => expect(part.startDateTime).toEqual("2024-06-01T23:00:00Z"));
    test("end", () => expect(part.endDateTime).toEqual(end));
    test("actualEnd is the same as the end", () => expect(part.actualEnd).toEqual(end));

    test("actualStart is 30 minutes before the start", () => {
      expect(part.actualStart).toEqual("2024-06-01T18:30:00-04:00")
    });
  });
});
