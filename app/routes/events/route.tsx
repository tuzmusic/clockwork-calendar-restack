import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";

import GoogleGig from "~/data/models/GoogleGig";
import Schedule from "~/data/models/Schedule";
import EmailParser from "~/data/parsers/emailParser/EmailParser";
import DistanceService from "~/data/services/DistanceService";
import EmailFixtureService from "~/data/services/EmailFixtureService";
import { EmailHtml } from "~/routes/events/components/EmailHtml";
import { FullGigUI } from "~/routes/events/components/FullGigUI";

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

  return (
    <div className="p-2 grid grid-cols-3">
      <h2>Email</h2>
      <h2>Final</h2>
      <h2>Calendar</h2>

      {eventRowsJson.map((row) =>
        <React.Fragment key={row.id}>
          {row.emailGig ? <EmailHtml gig={row.emailGig} /> : <div />}
          <FullGigUI gig={row.appGig} />
          <div />
        </React.Fragment>
      )}
    </div>
  );
};
