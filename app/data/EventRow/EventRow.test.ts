import { calendar_v3 } from "googleapis";
import { mock, MockProxy } from "vitest-mock-extended";

import DistanceService from "~/data/DistanceService";
import EmailGig from "~/data/EmailGig";
import EventRow from "~/data/EventRow/EventRow";
import GoogleGig from "~/data/EventRow/GoogleGig";
import FullCalendarGig from "~/data/FullCalendarGig";
import { getDistanceServiceWithMocks } from "~/data/tests/testUtils";
import { DistanceData } from "~/data/types";

const location = "wherever";
const start = "2024-12-01T19:00:00-04:00";
const end = "2024-12-01T23:00:00-04:00";
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
      describe("Email gig + Basic Calendar Gig; Basic info matches between the email and calendar gig", () => {
        const it = test.extend<{ row: EventRow }>({
          row: async ({ task: _ }, use) => {
            const mockData = mock<calendar_v3.Schema$Event>({
              start: { dateTime: start },
              end: { dateTime: end },
              location
            });
            const emailGig = EmailGig.make(location, start, end);
            const calendarGig = GoogleGig.make(mockData);

            const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
            expect(row).instanceof(EventRow);
            return await use(row);
          }
        });

        it("is a FullCalendarGig", ({ row: { appGig } }) => {
          expect(appGig).instanceof(FullCalendarGig);
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

      describe("Email gig + Full Calendar Gig; Basic info matches between the email and calendar gig", () => {
        const mockDistanceData = {
          fromHome: { miles: 1, minutes: 10, formattedTime: "10m" },
          withWaltham: { miles: 2, minutes: 20, formattedTime: "20m" },
          walthamDetour: { miles: 3, minutes: 30, formattedTime: "30m" },
          fromWaltham: { miles: 4, minutes: 40, formattedTime: "40m" },
          fromBoston: { miles: 5, minutes: 50, formattedTime: "0mm" }
        } satisfies Record<string, DistanceData>;

        const it = test.extend<{ row: EventRow }>({
          row: async ({ task: _ }, use) => {
            const mockDataWithRouteInfo = mock<calendar_v3.Schema$Event>({
              start: { dateTime: start },
              end: { dateTime: end },
              location,
              extendedProperties: {
                private: {
                  distanceInfo: JSON.stringify(mockDistanceData)
                }
              }
            });
            const emailGig = EmailGig.make(location, start, end);
            const calendarGig = GoogleGig.make(mockDataWithRouteInfo);

            const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
            expect(row).instanceof(EventRow);
            return await use(row);
          }
        });

        it("is a FullCalendarGig", ({ row: { appGig } }) => {
          expect(appGig).instanceof(FullCalendarGig);
        });

        it("has basic info that matches the email gig", ({ row: { appGig } }) => {
          expect(appGig.getLocation()).toEqual(location);
          expect(appGig.getStartTime().dateTime).toEqual(start);
          expect(appGig.getEndTime().dateTime).toEqual(end);
          expect(appGig.getId()).toEqual("2024-12-01");
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

      describe("Email gig + Basic Calendar Gig; Basic info differs between the email and calendar gig", () => {
        const updatedLocation = 'somewhere else'
        const it = test.extend<{ row: EventRow }>({
          row: async ({ task: _ }, use) => {
            const mockData = mock<calendar_v3.Schema$Event>({
              start: { dateTime: start },
              end: { dateTime: end },
              location
            });
            const emailGig = EmailGig.make(updatedLocation, start, end);
            const calendarGig = GoogleGig.make(mockData);

            const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
            expect(row).instanceof(EventRow);
            return await use(row);
          }
        });

        it("is a FullCalendarGig", ({ row: { appGig } }) => {
          expect(appGig).instanceof(FullCalendarGig);
        });

        it("has basic info that matches the email gig", ({ row: { appGig } }) => {
          expect(appGig.getLocation()).toEqual(updatedLocation);
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

      describe("Email gig + Full Calendar Gig; Location differs between the email and calendar gig", () => {
        const updatedLocation = 'somewher else'

        const mockDistanceData = {
          fromHome: { miles: 1, minutes: 10, formattedTime: "10m" },
          withWaltham: { miles: 2, minutes: 20, formattedTime: "20m" },
          walthamDetour: { miles: 3, minutes: 30, formattedTime: "30m" },
          fromWaltham: { miles: 4, minutes: 40, formattedTime: "40m" },
          fromBoston: { miles: 5, minutes: 50, formattedTime: "0mm" }
        } satisfies Record<string, DistanceData>;

        const it = test.extend<{ row: EventRow }>({
          row: async ({ task: _ }, use) => {
            const mockDataWithRouteInfo = mock<calendar_v3.Schema$Event>({
              start: { dateTime: start },
              end: { dateTime: end },
              location,
              extendedProperties: {
                private: {
                  distanceInfo: JSON.stringify(mockDistanceData)
                }
              }
            });
            const emailGig = EmailGig.make(updatedLocation, start, end);
            const calendarGig = GoogleGig.make(mockDataWithRouteInfo);

            const row = EventRow.buildRow(emailGig, calendarGig, distanceService);
            expect(row).instanceof(EventRow);
            return await use(row);
          }
        });

        it("is a FullCalendarGig", ({ row: { appGig } }) => {
          expect(appGig).instanceof(FullCalendarGig);
        });

        it("has basic info that matches the email gig", ({ row: { appGig } }) => {
          expect(appGig.getLocation()).toEqual(updatedLocation);
          expect(appGig.getStartTime().dateTime).toEqual(start);
          expect(appGig.getEndTime().dateTime).toEqual(end);
          expect(appGig.getId()).toEqual("2024-12-01");
        });

        it("keeps the distance info empty, because it's out of date", ({ row: { appGig } }) => {
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
          expect(appGig.getRouteInfo()).toBeNull()
        });

        it("can fill out the route info on demand", async ({ row: { appGig } }) => {
          expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
          await appGig.fetchRouteInfo();
          expect(distanceService.getDistanceInfo).toHaveBeenCalled();
          expect(appGig.getRouteInfo()).not.toBeNull();
        });
      });

    });
  });
});
