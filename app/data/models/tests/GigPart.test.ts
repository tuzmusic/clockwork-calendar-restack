import { GigPart } from "~/data/models/GigPart";
import { end, start } from "~/data/models/tests/testConstants";

class GigPartImpl extends GigPart {
}

describe("GigPart", () => {
  const part = new GigPartImpl("reception", start, end);

  test("type", () => expect(part.type).toEqual("reception"));
  test("start", () => expect(part.startDateTime).toEqual(start));
  test("end", () => expect(part.endDateTime).toEqual(end));
  test("actualStart is null by default", () => expect(part.actualStart).toBeNull());
  test("actualEnd is null by default", () => expect(part.actualEnd).toBeNull());
});
