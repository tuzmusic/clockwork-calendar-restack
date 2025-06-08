import React, { ComponentProps } from "react";

import { EventRowJson } from "~/data/models/EventRow";
import { CalendarGigUI } from "~/routes/events/components/CalendarGigUI";
import { EmailHtml } from "~/routes/events/components/EmailHtml";
import { FullGigUI } from "~/routes/events/components/FullGigUI";
import { RoundedWrapper } from "~/routes/events/components/RoundedWrapper";
import { SaveGigButton } from "~/routes/events/components/SaveGigButton";

export function EventsTable({ eventRows }: { eventRows: EventRowJson[] }) {
  return (
    <div data-testid="EVENTS_TABLE" className="grid sm:grid-cols-3 items-start gap-3">
      <div className={
        "hidden sm:grid col-span-3 grid-cols-3 gap-3 font-bold "
        + "*:bg-gray-200 *:w-full *:p-2"
      }>
        <h2>Email</h2>
        <h2 className="text-center">Final</h2>
        <h2 className="text-right">Calendar</h2>
      </div>

      {eventRows.map((row) => {
          const MobileWrapper = (props: ComponentProps<typeof RoundedWrapper>) =>
            <RoundedWrapper className={`hidden sm:visible ${props.className ?? ""}`}>
              {props.children}
            </RoundedWrapper>;

          return <React.Fragment key={row.id}>
            <MobileWrapper className={"bg-amber-500 sm:bg-amber-200"}>
              {row.emailGig ? <EmailHtml gig={row.emailGig} /> : null}
            </MobileWrapper>

            <RoundedWrapper>
              <FullGigUI row={row} />
            </RoundedWrapper>

            <MobileWrapper className={"bg-blue-200 sm:bg-blue-600"}>
              {row.googleGig
                ? <CalendarGigUI row={row} hasUpdates={row.hasUpdates} />
                : <SaveGigButton row={row} />}
            </MobileWrapper>
          </React.Fragment>;
        }
      )}

    </div>
  );
}
