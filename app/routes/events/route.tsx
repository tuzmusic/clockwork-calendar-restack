import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import FullCalendarGig from "~/data/models/FullCalendarGig";
import { Reception } from "~/data/models/GigParts/Reception";
import GoogleGig from "~/data/models/GoogleGig";
import Schedule from "~/data/models/Schedule";
import { getDistanceServiceWithMocks } from "~/data/models/tests/testUtils";
import EmailParser from "~/data/parsers/emailParser/EmailParser";
import DistanceService from "~/data/services/DistanceService";
import EmailService from "~/data/services/EmailService";
import GmailServiceServer from "~/data/services/GmailService.server";
import { EventsPage } from "~/routes/events/page/EventsPage";

export const PATH = "/events";

export async function loader(args: LoaderFunctionArgs, _emailService?: EmailService) {
  const emailService = _emailService ?? await GmailServiceServer.make(args.request); // new EmailFixtureService();
  const distanceService = new DistanceService();

  const html = await emailService.getMessageBody();

  const emailGigs = EmailParser.parseEmail(html);
  const remoteGigs: GoogleGig[] = [];
  const schedule = Schedule.build({ emailGigs, remoteGigs }, distanceService);

  const eventRowsJson = schedule.eventSets.map(set => set.serialize());
  return json({ eventRowsJson });
}


export enum EventsActionIntent {
  getDistanceInfo = "get-distance-info"
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

  const gig = JSON.parse(gigStr) as ReturnType<FullCalendarGig["serialize"]>;

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

export default function Events() {
  const { eventRowsJson } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  if (actionData) console.log(actionData, eventRowsJson);

  switch (actionData?.intent) {
    case EventsActionIntent.getDistanceInfo: {
      const updatedRow = eventRowsJson.find(row => row.id === actionData.id);
      if (updatedRow) {
        updatedRow.appGig.distanceInfo = actionData.distanceInfo;
        updatedRow.hasUpdates = true;
      }
    }
  }

  return <EventsPage eventRows={eventRowsJson} />;
};
