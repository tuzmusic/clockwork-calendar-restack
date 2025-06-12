import { Fetcher, useFetchers } from "@remix-run/react";

import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

export function useEventRouteFetchers() {
  const fetchers = useFetchers();
  const result: Record<(typeof EventsActionIntent)[keyof typeof EventsActionIntent], Fetcher | null> = {
    [EventsActionIntent.createEvent]: null,
    [EventsActionIntent.updateEvent]: null,
    [EventsActionIntent.getDistanceInfo]: null
  };

  fetchers.forEach(fetcher => {
    if (fetcher.state === "idle") {
      if ('intent' in fetcher.data && fetcher.data.intent in EventsActionIntent) {
        result[fetcher.data.intent] = fetcher;
      }
    }
  });
  return result;
}
