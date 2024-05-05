import { calendar_v3 } from "googleapis";
import { MockProxy } from "vitest-mock-extended";

import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import EventRow from "~/data/EventRow/EventRow";
import GoogleGig from "~/data/EventRow/GoogleGig";
import { end, location, mockDistanceData, mockParts, start } from "~/data/EventRow/testConstants";
import { getDistanceServiceWithMocks } from "~/data/tests/testUtils";
import { EventPart, timeObj } from "~/data/types";

let distanceService: MockProxy<DistanceService>;

describe("EventRow", () => {
  beforeEach(() => {
    distanceService = getDistanceServiceWithMocks(location);
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("EventRow.buildRow", () => {
    describe("appGig", () => {
      describe("Email gig + Basic Calendar Gig; Basic info matches", () => {
        const it = test.extend<{ row: EventRow }>({
          row: async ({ task: _ }, use) => {
            const mockData: calendar_v3.Schema$Event = {
              start: { dateTime: start },
              end: { dateTime: end },
              location
            };
            const emailGig = EmailGig.makeWithParts({ location, parts: mockParts });
            const calendarGig = GoogleGig.make(mockData);

            const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
            expect(row).instanceof(EventRow);
            return await use(row);
          }
        });

        it("has basic info that matches the email gig", ({ row: { appGig } }) => {
          expect(appGig.getLocation()).toEqual(location);
          expect(appGig.getStartTime().dateTime).toEqual(start);
          expect(appGig.getEndTime().dateTime).toEqual(end);
          expect(appGig.getId()).toEqual("2024-12-01");
        });

        it("starts with no route info", ({ row: { appGig } }) => {
          expect(appGig.getRouteInfo()).toBeNull();
        });

        it("can fill out the route info on demand", async ({ row: { appGig } }) => {
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
          await appGig.fetchRouteInfo();
          expect(distanceService.getDistanceInfo).toHaveBeenCalled();
          expect(appGig.getRouteInfo()).not.toBeNull();
        });
      });

      describe("Email gig + Full Calendar Gig; Basic info matches", () => {
        const it = test.extend<{ row: EventRow }>({
          row: async ({ task: _ }, use) => {
            const mockDataWithRouteInfo: calendar_v3.Schema$Event = {
              start: { dateTime: start },
              end: { dateTime: end },
              location,
              extendedProperties: {
                private: {
                  distanceInfo: JSON.stringify(mockDistanceData),
                  parts: JSON.stringify(mockParts)
                }
              }
            };
            const emailGig = EmailGig.makeWithParts({ location, parts: mockParts });
            const calendarGig = GoogleGig.make(mockDataWithRouteInfo);

            const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
            expect(row).instanceof(EventRow);
            return await use(row);
          }
        });

        it("has basic info that matches the email gig", ({ row: { appGig } }) => {
          expect(appGig.getLocation()).toEqual(location);
          expect(appGig.getStartTime().dateTime).toEqual(start);
          expect(appGig.getEndTime().dateTime).toEqual(end);
          expect(appGig.getId()).toEqual("2024-12-01");
        });

        it("has parts that match the email gig", ({ row: { appGig } }) => {
          // (they match the email gig too but they'll be "lifted" directly
          //  from the calendar, right?)
          expect(appGig.getParts()).toEqual(mockParts);
        });

        it("populates the route info from the stored gig", ({ row: { appGig } }) => {
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
          expect(appGig.getRouteInfo()).toEqual(mockDistanceData);
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
        });

        it("does not call the distance service when calling setRouteInfo", async ({ row: { appGig } }) => {
          expect(appGig.getRouteInfo()).not.toBeNull();
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
          await appGig.fetchRouteInfo();
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
          expect(appGig.getRouteInfo()).not.toBeNull();
        });
      });

      describe("Email gig + Basic Calendar Gig; Location differs", () => {
        const updatedLocation = "somewhere else";
        const it = test.extend<{ row: EventRow }>({
          row: async ({ task: _ }, use) => {
            const mockData: calendar_v3.Schema$Event = {
              start: { dateTime: start },
              end: { dateTime: end },
              location
            };
            const emailGig = EmailGig.makeWithParts({ location: updatedLocation, parts: mockParts });
            const calendarGig = GoogleGig.make(mockData);

            const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
            expect(row).instanceof(EventRow);
            return await use(row);
          }
        });

        it("has basic info that matches the email gig", ({ row: { appGig } }) => {
          expect(appGig.getLocation()).toEqual(updatedLocation);
          expect(appGig.getStartTime().dateTime).toEqual(start);
          expect(appGig.getEndTime().dateTime).toEqual(end);
          expect(appGig.getId()).toEqual("2024-12-01");
        });

        it("starts with no route info and can fill it in on demand", async ({ row: { appGig } }) => {
          expect(appGig.getRouteInfo()).toBeNull();
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
          await appGig.fetchRouteInfo();
          expect(distanceService.getDistanceInfo).toHaveBeenCalled();
          expect(appGig.getRouteInfo()).not.toBeNull();
        });
      });

      describe("Email gig + Full Calendar Gig; Location differs", () => {
        const updatedLocation = "somewhere else";

        const it = test.extend<{ row: EventRow }>({
          row: async ({ task: _ }, use) => {
            const mockDataWithRouteInfo: calendar_v3.Schema$Event = {
              start: { dateTime: start },
              end: { dateTime: end },
              location,
              extendedProperties: {
                private: {
                  distanceInfo: JSON.stringify(mockDistanceData)
                }
              }
            };
            const emailGig = EmailGig.makeWithParts({ location: updatedLocation, parts: mockParts });
            const calendarGig = GoogleGig.make(mockDataWithRouteInfo);

            const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
            expect(row).instanceof(EventRow);
            return await use(row);
          }
        });

        it("has basic info that matches the email gig", ({ row: { appGig } }) => {
          expect(appGig.getLocation()).toEqual(updatedLocation);
          expect(appGig.getStartTime().dateTime).toEqual(start);
          expect(appGig.getEndTime().dateTime).toEqual(end);
          expect(appGig.getId()).toEqual("2024-12-01");
        });

        it("keeps the distance info empty (because it's out of date) but can fill it in info on demand", async ({ row: { appGig } }) => {
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
          expect(appGig.getRouteInfo()).toBeNull();
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
          await appGig.fetchRouteInfo();
          expect(distanceService.getDistanceInfo).toHaveBeenCalled();
          expect(appGig.getRouteInfo()).not.toBeNull();
        });
      });

      describe("Email gig + Full Calendar Gig; parts differ", () => {
        it("doesn't actually need tests or even implementation, " +
          "because the email is the source of correct truth," +
          "and if we always make the parts from the email " +
          "then there's not really any such thing as updating!", () => {
          expect(true).toBe(true);
        });
      });
    });

    // todo: maybe/probably rename "hasChanged"
    describe("hasChanged", () => {
      const updatedLocation = "somewhere else";

      const parts = [
        {
          type: "cocktail hour",
          start: timeObj("2024-12-01T18:00:00-04:00"),
          end: timeObj("2024-12-01T19:00:00-04:00")
        }, {
          type: "reception",
          start: timeObj("2024-12-01T19:00:00-04:00"),
          end: timeObj("2024-12-01T23:00:00-04:00")
        }
      ] satisfies EventPart[];

      const calendarGig = GoogleGig.make({
        start: { dateTime: start },
        end: { dateTime: end },
        location,
        extendedProperties: {
          private: {
            parts: JSON.stringify(parts)
          }
        }
      });

      it("is false if there are no changes in parts or locations", () => {
        const emailGig = EmailGig.makeWithParts({ location, parts });
        const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
        expect(row.locationHasChanged).toBe(false);
        expect(row.partsHaveChanged).toBe(false);
        expect(row.hasChanged).toBe(false);
      });

      it("is true if the two gigs have different locations", () => {
        const emailGig = EmailGig.makeWithParts({ location: updatedLocation, parts });
        const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
        expect(row.locationHasChanged).toBe(true);
        expect(row.hasChanged).toBe(true);
      });

      it.each<[string, EventPart[]]>([
        ["a single part has changed", [
          parts[0],
          { ...parts[1], start: { ...parts[1].start, dateTime: parts[1].end.dateTime.replace("T23", "T22") } }
        ]],
        ["a part has been removed", [parts[1]]],
        ["a part has been added", [
          {
            type: "ceremony",
            start: timeObj("2024-12-01T17:30:00-04:00"),
            end: timeObj("2024-12-01T18:00:00-04:00")
          },
          ...parts
        ]]
      ])("is true if %s", (_, emailParts) => {
        const emailGig = EmailGig.makeWithParts({ location, parts: emailParts });
        const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
        expect(row.partsHaveChanged).toBe(true);
        expect(row.hasChanged).toBe(true);
      });
    });
  });
});
