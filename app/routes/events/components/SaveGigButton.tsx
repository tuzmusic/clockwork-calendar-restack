import { useFetcher } from "@remix-run/react";

import { EventRowJson } from "~/data/models/EventRow";
import { CenteredButton } from "~/routes/events/components/CenteredButton";
import { EventsActionIntent } from "~/routes/events/route";

// TODO: "encode" event details in event name so it can be
//  better understood at a glance
function getEventTitle(_appGig: EventRowJson['appGig']) {
  return 'Clockwork Gig'
}

/*

export function constructGoogleEvent(appGig: EventRowJson['appGig']) {
  // if no offset is specified, google will just put it in the
  // specified time zone! 🤦
  const formatWithoutTzOffset ='YYYY-MM-DDTHH:mm:ss'

  return {
    summary: getEventTitle(appGig),
    location: appGig.location,
    description: appGig.description,
    start: {
      timeZone: TIME_ZONE,
      dateTime: dayjs(appGig.startTime).format(formatWithoutTzOffset),
    },
    end: {
      timeZone: TIME_ZONE,
      dateTime: dayjs(appGig.endTime).format(formatWithoutTzOffset),
    },
  } satisfies calendar_v3.Schema$Event
}


function makeEvent(event: EventRowJson['appGig']) {
  const eventObj = constructGoogleEvent(event)
  const eventStr = JSON.stringify(eventObj)
  // if submit function is called with just a string, it makes it the key of an object,
  // so we need to wrap our JSONified string in an object.
  return { event: eventStr }
}
*/


export function SaveGigButton({ row }: { row: EventRowJson }) {
  const { Form, state } = useFetcher();

  return (
    <Form method="post" id={row.id} className="h-full">
      <input type='hidden' name='appGig' value={JSON.stringify(row.appGig)}/>
      <CenteredButton
        name="intent"
        value={EventsActionIntent.createEvent}
        data-testid={"SAVE_BUTTON"}>
          {state === "idle" ? "Save" : "Saving..."}
      </CenteredButton>
    </Form>
  );
}
