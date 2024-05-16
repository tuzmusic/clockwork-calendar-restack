import React from "react";

import { EventRowJson } from "~/data/models/EventRow";
import { EmailHtml } from "~/routes/events/components/EmailHtml";
import { FullGigUI } from "~/routes/events/components/FullGigUI";

export function EventsPage({ eventRows }: { eventRows: EventRowJson[] }) {
  console.log(eventRows);
  return (
    <div className="p-2 grid grid-cols-3 items-start gap-3">
      <h2>Email</h2>
      <h2>Final</h2>
      <h2>Calendar</h2>

      {eventRows.map((row) =>
        <React.Fragment key={row.id}>
          {row.emailGig ? <EmailHtml gig={row.emailGig} /> : <div />}
          <FullGigUI gig={row.appGig} />
          <div />
        </React.Fragment>
      )}
    </div>
  );
}
