import { useLoaderData } from "@remix-run/react";

import { action } from "~/routes/events/eventsAction.server";
import { EventsPage } from "~/routes/events/page/EventsPage";

import { loader } from "./eventsLoader.server";

export const PATH = "/events";

export { action, loader };

export default function EventsRoute() {
  const { eventRowsJson } = useLoaderData<typeof loader>();

  return <EventsPage eventRows={eventRowsJson} />;
};
