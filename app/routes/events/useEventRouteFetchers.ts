import { Fetcher, useFetchers } from "@remix-run/react";

import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

function isValidIntent(intent: string) {
  return Object.values(EventsActionIntent).includes(intent);
}

export function useEventRouteFetchers() {
  const fetchers = useFetchers();
  const result: Record<(typeof EventsActionIntent)[keyof typeof EventsActionIntent], Fetcher | null> = {
    [EventsActionIntent.createEvent]: null,
    [EventsActionIntent.updateEvent]: null,
    [EventsActionIntent.getDistanceInfo]: null
  };

  fetchers.forEach(fetcher => {
    if (fetcher.state === "idle" || fetcher.state === "loading") {
      if ("intent" in fetcher.data && isValidIntent(fetcher.data.intent)) {
        result[fetcher.data.intent] = fetcher;
      }
    }
  });
  return result;
}
