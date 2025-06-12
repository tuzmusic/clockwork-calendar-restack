import { ActionFunctionArgs, json } from "@remix-run/node";

import { selectedCalendarCookie } from "~/auth/cookies.server";
import FullCalendarGig, { FullCalendarGigJson } from "~/data/models/FullCalendarGig";
import { Reception } from "~/data/models/GigParts/Reception";
import { mockDistanceData } from "~/data/models/tests/testConstants";
import GoogleCalendarService from "~/data/parsers/emailParser/tests/GoogleCalendarService";
import AccountService from "~/data/services/AccountService.server";
import DistanceService from "~/data/services/DistanceService";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

export async function action(
  args: ActionFunctionArgs,
  _distanceService?: DistanceService
) {

  const formData = await args.request.formData();
  const { gig: gigStr, intent } = Object.fromEntries(formData) as {
    gig: string,
    intent: EventsActionIntent
  };
  const gigJson = JSON.parse(gigStr) as FullCalendarGigJson;
  const gig = FullCalendarGig.deserialize(gigJson);

  const useFixture = new URL(args.request.url).searchParams.get("useFixture");
  if (useFixture && useFixture !== "false") {
    switch (intent) {
      case EventsActionIntent.getDistanceInfo:
        return {
          intent,
          id: gig.getId(),
          distanceInfo: mockDistanceData
        };
      case EventsActionIntent.updateEvent:
      case EventsActionIntent.createEvent:
        return { intent, id: gig.getId() };
    }
  }

  await AccountService.authenticate(args.request);
  const calendarId = await selectedCalendarCookie.parse(
    args.request.headers.get("Cookie")
  );
  if (!calendarId) throw json("Could not get calendar id to post new event", 500);

  const calendarService = new GoogleCalendarService(calendarId);


  switch (intent) {
    case EventsActionIntent.createEvent: {
      const response = await gig.store(calendarService);
      return { response, intent, id: gig.getId() };
    }

    case EventsActionIntent.updateEvent: {
      const response = await gig.update(calendarService);
      return { response, intent, id: gig.getId() };
    }

    case EventsActionIntent.getDistanceInfo: {
      // todo deserialize?
      const dummyGig = FullCalendarGig.make({
        location: gigJson.location,
        distanceService: _distanceService ?? new DistanceService(),
        parts: [
          // we have the gigJson but it's not really worth extracting it to make parts
          // (although we could use makeGigPartsFromJson, sorta)
          new Reception("2024-12-01T19:00:00", "2024-12-01T21:00:00")
        ]
      });

      await dummyGig.fetchDistanceInfo();

      return json({ id: gigJson.id, distanceInfo: dummyGig.getDistanceInfo(), intent });
    }

    default:
      break;
  }

  return null;
}
