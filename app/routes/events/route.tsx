import { useActionData, useLoaderData } from "@remix-run/react";

import { action, EventsActionIntent } from "~/routes/events/eventsAction.server";
import { EventsPage } from "~/routes/events/page/EventsPage";

import { loader } from "./eventsLoader.server";

export const PATH = "/events";

export { action, loader };

export default function EventsRoute() {
  const { eventRowsJson } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  if (actionData) console.log(actionData, eventRowsJson);

  switch (actionData?.intent) {
    case EventsActionIntent.getDistanceInfo: {
      const updatedRow = eventRowsJson.find(row => row.id === actionData.id);
      if (updatedRow) {
        updatedRow.appGig.distanceInfo = actionData.distanceInfo;
        updatedRow.hasUpdates = true;
      }
    }
  }

  return <EventsPage eventRows={eventRowsJson} />;
};
