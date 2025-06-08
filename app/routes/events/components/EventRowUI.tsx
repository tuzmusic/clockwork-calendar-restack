import React, { ComponentProps } from "react";

import { EventRowJson } from "~/data/models/EventRow";
import { CalendarGigUI } from "~/routes/events/components/CalendarGigUI";
import { EmailHtml } from "~/routes/events/components/EmailHtml";
import { FullGigUI } from "~/routes/events/components/FullGigUI";
import { SaveGigButton } from "~/routes/events/components/GigButtons";
import { RoundedWrapper } from "~/routes/events/components/RoundedWrapper";

const MobileWrapper = (props: ComponentProps<typeof RoundedWrapper>) =>
  <RoundedWrapper className={`hidden sm:block ${props.className ?? ""}`}>
    {props.children}
  </RoundedWrapper>;

export function EventRowUI({ row }: { row: EventRowJson }) {
  return <React.Fragment key={row.id}>
    <MobileWrapper className={"bg-amber-500 sm:bg-amber-200"}>
      {row.emailGig ? <EmailHtml gig={row.emailGig} /> : null}
    </MobileWrapper>

    <RoundedWrapper>
      <FullGigUI row={row} />
    </RoundedWrapper>

    <MobileWrapper className={"bg-blue-600 sm:bg-blue-200"}>
      {row.googleGig
        ? <CalendarGigUI row={row} hasUpdates={row.hasUpdates} />
        : <SaveGigButton row={row} />}
    </MobileWrapper>
  </React.Fragment>;
}
