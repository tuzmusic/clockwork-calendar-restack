import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import FullCalendarGig from "~/data/models/FullCalendarGig";
import { Reception } from "~/data/models/GigParts/Reception";
import GoogleGig from "~/data/models/GoogleGig";
import Schedule from "~/data/models/Schedule";
import { getDistanceServiceWithMocks } from "~/data/models/tests/testUtils";
import EmailParser from "~/data/parsers/emailParser/EmailParser";
import DistanceService from "~/data/services/DistanceService";
import EmailFixtureService from "~/data/services/EmailFixtureService";
import EmailService from "~/data/services/EmailService";
import { EventsPage } from "~/routes/events/page/EventsPage";

export const PATH = "/events";

export async function loader(_args: LoaderFunctionArgs, _emailService?: EmailService) {
  const emailService = _emailService ?? new EmailFixtureService();
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
  const { location, intent } = Object.fromEntries(formData) as {
    location: string,
    intent: EventsActionIntent
  };

  if (intent === EventsActionIntent.getDistanceInfo) {
    // todo: send whole event, or find a way to get this info without needing an event
    const dummyGig = FullCalendarGig.make({
      location,
      distanceService: distanceService ?? getDistanceServiceWithMocks(location),
      parts: [
        new Reception(
          "2024-12-01T19:00:00-04:00",
          "2024-12-01T21:00:00-04:00"
        )]
    });

    await dummyGig.fetchDistanceInfo();

    // todo: we actually do need to identify the event by id,
    //  so we should probably send the whole jsonified gig,
    //  which means we need FullCalendarGig.makeFromJson()a
    return json(dummyGig.getDistanceInfo());
  }

  console.log("BEFORE BEFORE BEFORE");
  await distanceService?.getDistanceInfo({
    from: "",
    to: ""
  });
  console.log("AFTER AFTER AFTER");
  return { hello: "world" };
}

export default function Events() {
  const { eventRowsJson } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  console.log(actionData);
  return <EventsPage eventRows={eventRowsJson} />;
};
