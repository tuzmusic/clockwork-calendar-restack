import { useFetcher } from "@remix-run/react";

import DayJsTz from "~/data/models/DayJsTz";
import { EventRowJson } from "~/data/models/EventRow";
import { CenteredButton } from "~/routes/events/components/CenteredButton";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

export function CalendarGigUI({ row, hasUpdates }: { row: EventRowJson, hasUpdates: boolean }) {
  const gig = row.googleGig
  const { Form, state } = useFetcher();

  if (!gig) return null

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
          <input type='hidden' name='gig' value={JSON.stringify(row.appGig)} />
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
