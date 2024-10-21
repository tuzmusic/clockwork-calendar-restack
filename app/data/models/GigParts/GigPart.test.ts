import { Ceremony } from "~/data/models/GigParts/Ceremony";
import { CocktailHour } from "~/data/models/GigParts/CocktailHour";
import { GigPart } from "~/data/models/GigParts/GigPart";
import { Reception } from "~/data/models/GigParts/Reception";
import { end, start } from "~/data/models/tests/testConstants";

class GigPartImpl extends GigPart {
}

describe("GigPart", () => {
  describe("base class", () => {
    const part = new GigPartImpl("reception", start, end);
    test("type", () => expect(part.type).toEqual("reception"));
    test("start", () => expect(part.startDateTime).toEqual(start));
    test("end", () => expect(part.endDateTime).toEqual(end));
    test("actualStart is equal to the start", () => expect(part.actualStartDateTime).toEqual(start));
    test("actualEnd is equal to the end", () => expect(part.actualEndDateTime).toEqual(end));
  });

  describe("Reception", () => {
    const part = new Reception(start, end);
    test("type", () => expect(part.type).toEqual("reception"));
    test("start", () => expect(part.startDateTime).toEqual(start));
    test("end", () => expect(part.endDateTime).toEqual(end));
    test("actualStart is equal to the start", () => expect(part.actualStartDateTime).toEqual(start));
    test("actualEnd is equal to the end", () => expect(part.actualEndDateTime).toEqual(end));
  });

  describe("Cocktail Hour", () => {
    const part = new CocktailHour(start, end);
    test("type", () => expect(part.type).toEqual("cocktail hour"));
    test("start", () => expect(part.startDateTime).toEqual(start));
    test("end", () => expect(part.endDateTime).toEqual(end));
    test("actualStart is equal to the start", () => expect(part.actualStartDateTime).toEqual(start));
    test("actualEnd is equal to the end", () => expect(part.actualEndDateTime).toEqual(end));
  });

  describe("Ceremony", () => {
    const ceremonyStart = "2024-06-01T17:30:00"
    const ceremonyEnd = "2024-06-01T18:00:00"
    const part = new Ceremony(ceremonyStart, ceremonyEnd);
    test("type", () => expect(part.type).toEqual("ceremony"));
    test("start", () => expect(part.startDateTime).toEqual(ceremonyStart));
    test("end", () => expect(part.endDateTime).toEqual(ceremonyEnd));
    test("actualEnd is the same as the end", () => expect(part.actualEndDateTime).toEqual(ceremonyEnd));

    test("actualStart is 30 minutes before the start", () => {
      expect(part.actualStartDateTime).toEqual("2024-06-01T17:00:00");
    });
  });

  describe("Serialization", () => {
    it("serializes with all its props", () => {

      const part = new Reception(start, end);
      expect(part.serialize()).toEqual({
        type: "reception",
        startDateTime: start,
        endDateTime: end,
        actualStartDateTime: start,
        actualEndDateTime: end
      });
    });
  });
});
