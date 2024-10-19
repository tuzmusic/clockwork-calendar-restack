import { useFetcher } from "@remix-run/react";

import DayJsTz from "~/data/models/DayJsTz";
import GoogleGig from "~/data/models/GoogleGig";
import { CenteredButton } from "~/routes/events/components/CenteredButton";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

export function CalendarGigUI({ gig, hasUpdates }: { gig: ReturnType<GoogleGig["serialize"]>, hasUpdates: boolean }) {
  const { Form, state } = useFetcher();

  const [start, end] = [gig.startDateTime, gig.endDateTime].map(
    d => DayJsTz(d).format("h:mma")
  );
  const date = <>{DayJsTz(gig.id).format("M/D/YY")}</>;
  return (
    <div className="p-2 h-full flex flex-col">
      <ul className="text-right">
        <li className="font-bold">{date}</li>
        <li>{gig.location}</li>
        <li>{start}-{end}</li>
      </ul>
      {hasUpdates ?
        <Form method="post" id={gig.id} className="mt-auto ml-auto w-min">
          <CenteredButton
            name="intent"
            value={EventsActionIntent.updateEvent}
            data-testid="UPDATE_BUTTON">
            {state === "idle" ? "Update" : "Updating..."}
          </CenteredButton>
        </Form>
        : null}
    </div>
  );
}
