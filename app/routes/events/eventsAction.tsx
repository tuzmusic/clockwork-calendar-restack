import { ActionFunctionArgs, json } from "@remix-run/node";

import FullCalendarGig, { FullCalendarGigJson } from "~/data/models/FullCalendarGig";
import { Reception } from "~/data/models/GigParts/Reception";
import { getDistanceServiceWithMocks } from "~/data/models/tests/testUtils";
import DistanceService from "~/data/services/DistanceService";

export enum EventsActionIntent {
  getDistanceInfo = "get-distance-info",
  createEvent = "create-event",
}

export async function action(
  args: ActionFunctionArgs,
  distanceService?: DistanceService
) {
  const formData = await args.request.formData();
  const { gig: gigStr, intent } = Object.fromEntries(formData) as {
    gig: string,
    intent: EventsActionIntent
  };

  const gig = JSON.parse(gigStr) as FullCalendarGigJson;

  if (intent === EventsActionIntent.getDistanceInfo) {
    // todo: FullCalendarGig.makeFromJson
    const dummyGig = FullCalendarGig.make({
      location: gig.location,
      distanceService: distanceService ?? getDistanceServiceWithMocks(gig.location),
      parts: [
        // we have the gig but it's not really worth extracting it to make parts
        // (although we could use makeGigPartsFromJson, sorta)
        new Reception("2024-12-01T19:00:00-04:00", "2024-12-01T21:00:00-04:00")
      ]
    });

    await dummyGig.fetchDistanceInfo();

    return json({ id: gig.id, distanceInfo: dummyGig.getDistanceInfo(), intent });
  }

  return null;
}
