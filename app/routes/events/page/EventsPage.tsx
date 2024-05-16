import React from "react";

import { EventRowJson } from "~/data/models/EventRow";
import { CalendarGigUI } from "~/routes/events/components/CalendarGigUI";
import { EmailHtml } from "~/routes/events/components/EmailHtml";
import { FullGigUI } from "~/routes/events/components/FullGigUI";
import { RoundedWrapper } from "~/routes/events/components/RoundedWrapper";
import { SaveButton } from "~/routes/events/components/SaveButton";

export function EventsPage({ eventRows }: { eventRows: EventRowJson[] }) {
  return (
    <div className="p-2 grid grid-cols-3 items-start gap-3">
      <div className="col-span-3 p-2 grid grid-cols-3 gap-3 bg-gray-200 font-bold">
        <h2>Email</h2>
        <h2 className="mx-auto">Final</h2>
        <h2 className="ml-auto">Calendar</h2>
      </div>

      {eventRows.map((row) =>
        <React.Fragment key={row.id}>
          <RoundedWrapper>
            {row.emailGig ? <EmailHtml gig={row.emailGig} /> : null}
          </RoundedWrapper>

          <RoundedWrapper>
            <FullGigUI gig={row.appGig} />
          </RoundedWrapper>

          <RoundedWrapper>
            {row.googleGig
              ? <CalendarGigUI gig={row.googleGig} hasChanged={row.hasChanged}/>
              : <SaveButton>Save</SaveButton>}
          </RoundedWrapper>
        </React.Fragment>
      )}
    </div>
  );
}
