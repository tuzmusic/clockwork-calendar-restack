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

describe("GigPart", () => {
  describe("base class", () => {
    const part = new GigPartImpl("reception", start, end);
    test("type", () => expect(part.type).toEqual("reception"));
    test("start", () => expect(part.startDateTime).toEqual(start));
    test("end", () => expect(part.endDateTime).toEqual(end));
    // todo: actualStart should actually be equal to start
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
});
