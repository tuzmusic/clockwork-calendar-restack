import { mock } from "vitest-mock-extended";

import { TIME_ZONE } from "~/data/models/constants";
import FullCalendarGig, { FullCalendarGigJson } from "~/data/models/FullCalendarGig";
import { CocktailHour } from "~/data/models/GigParts/CocktailHour";
import { Reception } from "~/data/models/GigParts/Reception";
import {
  cocktailHourPart,
  cocktailHourPartJSON,
  location,
  mockReceptionJSONWithActual,
  mockReceptionPart,
  receptionPart
} from "~/data/models/tests/testConstants";
import { getDistanceServiceWithMocks } from "~/data/models/tests/testUtils";
import { DistanceData } from "~/data/models/types";
import CalendarFixtureService from "~/data/services/CalendarFixtureService";
import DistanceService from "~/data/services/DistanceService";

describe("FullCalendarGig.make", () => {
  describe("deserialize", () => {
    const gigJson = mock<FullCalendarGigJson>({
        id: '12-34-2029', // calculation doesn't matter, right?
        location: "Boston",
        parts: [mockReceptionJSONWithActual, cocktailHourPartJSON]
      }
    );

    const gig = FullCalendarGig.deserialize(gigJson);
    const parts = gig.getParts();

    test("location", () => {
      expect(gig.getLocation()).toEqual("Boston");
    });

    it("ID", () => {
      expect(gig.getId()).toEqual(
        // not good testing since this reproduces the implementation
        // but whatever
        mockReceptionJSONWithActual.actualStartDateTime.split('T')[0]
      );
    });

    it("parts", () => {
      expect(parts[0]).toBeInstanceOf(CocktailHour);
      expect(parts[1]).toBeInstanceOf(Reception);
      expect(parts[0]).toEqual(cocktailHourPart);
      expect(parts[1]).toEqual(mockReceptionPart);
    });
  });

  describe("distance info", () => {
    test("It gets distance info from the Distance Service", async () => {
      const distanceService = mock<DistanceService>();
      distanceService.getDistanceInfo.mockResolvedValue({
        miles: 10, minutes: 60, formattedTime: "1h"
      } satisfies DistanceData);

      const fullGig = FullCalendarGig.make({
        location,
        parts: [receptionPart],
        distanceService
      });

      expect(distanceService.getDistanceInfo).not.toHaveBeenCalled();
      await fullGig.fetchDistanceInfo();
      expect(distanceService.getDistanceInfo).toHaveBeenCalled();
    });

    const it = test.extend<{ gig: FullCalendarGig }>({
      gig: async ({ task: _ }, use) => {
        const distanceService = getDistanceServiceWithMocks(location);

        const newGig = FullCalendarGig.make({
          location,
          parts: [receptionPart],
          distanceService
        });

        await newGig.fetchDistanceInfo();
        const distanceInfo = newGig.getDistanceInfo();
        if (!distanceInfo) {
          throw Error("Fetched route info but it is null");
        }
        return await use(newGig);
      }
    });

    describe("Gets the correct distance info", () => {
      it("withWaltham", ({ gig }) => {
        expect(gig.getDistanceInfo()?.withWaltham).toEqual({
          miles: expect.any(Number),
          minutes: 120,
          formattedTime: "2h"
        });
      });

      it("fromHome", ({ gig }) => {
        expect(gig.getDistanceInfo()?.fromHome).toEqual({
          miles: expect.any(Number),
          minutes: 90,
          formattedTime: "1h 30m"
        });
      });

      it("fromWaltham", ({ gig }) => {
        expect(gig.getDistanceInfo()?.fromWaltham).toEqual({
          miles: expect.any(Number),
          minutes: 45,
          formattedTime: "45m"
        });
      });

      it("walthamDetour", ({ gig }) => {
        expect(gig.getDistanceInfo()?.walthamDetour).toEqual({
          miles: 10,
          minutes: 30,
          formattedTime: "30m"
        });
      });

      it("fromBoston", ({ gig }) => {
        expect(gig.getDistanceInfo()?.fromBoston).toEqual({
          miles: 65,
          minutes: 70,
          formattedTime: "1h 10m"
        });
      });
    });

    describe("Saving the event", () => {
      const calendarService = new CalendarFixtureService();
      const postEventMock = vi.spyOn(calendarService, "postEvent");

      const testCall = async (gig: FullCalendarGig) => {
        vi.resetAllMocks();
        await gig.store(calendarService);
        return postEventMock.mock.calls[0]?.[0];
      };

      it("includes the location in the payload as extendedProperties", async ({ gig }) => {
        expect(await testCall(gig)).toMatchObject({ location });
      });

      it("includes the startTime the payload as extendedProperties", async ({ gig }) => {
        expect(await testCall(gig)).toMatchObject({
          start: {
            dateTime: receptionPart.startDateTime,
            timeZone: TIME_ZONE
          }
        });
      });

      it("includes the endTime the payload as extendedProperties", async ({ gig }) => {
        expect(await testCall(gig)).toMatchObject({
          end: {
            dateTime: receptionPart.endDateTime,
            timeZone: TIME_ZONE
          }
        });
      });

      it("includes the route info in the payload as extendedProperties", async ({ gig }) => {
        const call = await testCall(gig);
        const distanceInfoStr = call.extendedProperties!.private!.distanceInfo!;
        expect(distanceInfoStr.length).toBeLessThanOrEqual(1024);

        const distanceInfo = JSON.parse(distanceInfoStr);
        expect(distanceInfo).toMatchObject({
          withWaltham: expect.objectContaining({
            miles: expect.any(Number),
            minutes: expect.any(Number),
            formattedTime: expect.any(String)
          })
        });
      });
    });
  });

  // storing extended props (for new gig only, right?)
  describe.todo("Event Parts");

})
;
