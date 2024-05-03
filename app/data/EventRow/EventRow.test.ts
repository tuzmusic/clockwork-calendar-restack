import { calendar_v3 } from "googleapis";
import { MockProxy } from "vitest-mock-extended";

import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import EventRow from "~/data/EventRow/EventRow";
import GoogleGig from "~/data/EventRow/GoogleGig";
import { end, location, mockDistanceData, mockPart, start } from "~/data/EventRow/testConstants";
import { getDistanceServiceWithMocks } from "~/data/tests/testUtils";

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
            const emailGig = EmailGig.make(location, start, end);
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
                  parts: JSON.stringify([mockPart])
                }
              }
            };
            const emailGig = EmailGig.make(location, start, end);
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

        it("has parts that match the calendar gig", ({ row: { appGig } }) => {
          expect(appGig.getParts()).toEqual([mockPart]);
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
            const emailGig = EmailGig.make(updatedLocation, start, end);
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
        const updatedLocation = "somewher else";

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
            const emailGig = EmailGig.make(updatedLocation, start, end);
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
        describe("Reception only (event time === part time)", () => {
          // TODO: event time is actually determined by the outer parts time!
          /** Some other thoughts
           * EmailGig needs to be able to build in pieces, since the html is parsed in steps.
           * Its members may be protected but it can expose methods for setting them piece by piece.
           *
           * Although gig start and end time is actually determined by the outer parts,
           * We use those outer marks as start/end in JSON, to show the "gig times" in the UI
           * and to write the event to google.
           * */
          it.fails('uses the times and parts from the email gig')
        });
      });
    });
  });
});
