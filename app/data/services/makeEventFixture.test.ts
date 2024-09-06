import { calendar_v3 } from "googleapis";

import { TIME_ZONE } from "~/data/models/constants";
import DayJsTz from "~/data/models/DayJsTz";
import { GigPart } from "~/data/models/GigParts/GigPart";
import { Reception } from "~/data/models/GigParts/Reception";
import { location } from "~/data/models/tests/testConstants";
import { buildEvent, buildHtml, buildMonthHeader, buildOtherPart } from "~/data/parsers/emailParser/tests/htmlBuilders";

interface EventFixture {
  parts: GigPart[];
  location: string;
}
function makeEmailFixture(event: EventFixture) {
  const getTimeStr = (part: GigPart) => [part.startDateTime, part.endDateTime]
    .map(t => DayJsTz(t).format("h:mm"))
    .join("-");

  const reception = event.parts.find(p => p.type === "reception")!;
  const otherParts = event.parts.filter(p => p.type !== "reception")!;
  const date = DayJsTz(reception.startDateTime);

  const month = date.format("MMMM");
  let innerHtml = buildMonthHeader(month);

  innerHtml += buildEvent({ dateNum: date.date(), timeStr: getTimeStr(reception) });

  (["ceremony", "cocktails"]).forEach(type => {
    const part = otherParts.find(p => p.type === type);
    if (part) {
      const [first, ...chars] = type;
      const capType = first.toUpperCase() + chars.join("");
      innerHtml += buildOtherPart({ timeStr: getTimeStr(part), part: capType });
    }
  });

  return buildHtml(innerHtml);
}

function makeEventFixture(events: Array<EventFixture | [EventFixture, EventFixture]>):
  Array<[string, calendar_v3.Schema$Event]> {


  // const tuples = events.map(event => {
  //
  // })

  return [];
}

describe("makeEventFixture", () => {
  describe("makeEmailFixture", () => {

  });

  it("makes matching email and calendar fixtures with one argument", () => {
    const startDateTime = "2024-07-08T18:00-04:00";
    const endDateTime = "2024-07-08T22:30-04:00";
    const fixture = {
      location,
      parts: [new Reception(startDateTime, endDateTime)]
    } satisfies EventFixture;

    const expectedEmail = buildHtml(
      buildMonthHeader("July"),
      buildEvent({ dateNum: 8, timeStr: "6:00-10:30", location })
    );

    const expectedCalJson = {
      location,
      start: { dateTime: startDateTime, timeZone: TIME_ZONE },
      end: { dateTime: endDateTime, timeZone: TIME_ZONE }
    } satisfies calendar_v3.Schema$Event;

    const [emailHtml, calendarJson] = makeEventFixture([fixture])[0];

    expect(emailHtml).toEqual(expectedEmail);
    expect(calendarJson).toMatchObject(expectedCalJson);
  });
});
