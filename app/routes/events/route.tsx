import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import GoogleGig from "~/data/models/GoogleGig";
import Schedule from "~/data/models/Schedule";
import EmailParser from "~/data/parsers/emailParser/EmailParser";
import DistanceService from "~/data/services/DistanceService";
import EmailFixtureService from "~/data/services/EmailFixtureService";

export async function loader(_args: LoaderFunctionArgs) {
  const emailService = new EmailFixtureService();
  const html = await emailService.getMessageBody();

  const emailGigs = EmailParser.parseEmail(html);
  const remoteGigs: GoogleGig[] = [];
  const schedule = Schedule.build({
      emailGigs,
      remoteGigs
    },
    new DistanceService()
  );

  const eventRowsJson = schedule.eventSets.map(set => set.serialize());
  return json({ eventRowsJson });
}

export default function Events() {
  const { eventRowsJson } = useLoaderData<typeof loader>();

  return <pre>{JSON.stringify(eventRowsJson, null, 2)}</pre>;
}
