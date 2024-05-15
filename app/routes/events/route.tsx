import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";

import { EventRowJson } from "~/data/models/EventRow";
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

function EmailHtml({ row }: { row: EventRowJson }) {
  return <table>
    <tbody dangerouslySetInnerHTML={{ __html: row.emailGig?.originalHtml ?? "(email html here)" }} />
  </table>;
}

export default function Events() {
  const { eventRowsJson } = useLoaderData<typeof loader>();

  return (
    <div className="p-2 w-11/12 h-1/2 grid grid-cols-3">
      <h2>Email</h2>
      <h2>Final</h2>
      <h2>Calendar</h2>

      {eventRowsJson.map((row) =>
        <React.Fragment key={row.id}>
          <EmailHtml row={row} />
          <div />
          <div />
        </React.Fragment>
      )}
    </div>
  );
};
