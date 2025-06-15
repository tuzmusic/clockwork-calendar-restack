import { Fetcher, useFetchers } from "@remix-run/react";

import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

function isValidIntent(intent: string) {
  return Object.values(EventsActionIntent).includes(intent);
}

export function useEventRouteFetchers() {
  const fetchers = useFetchers();
  const result: Record<(typeof EventsActionIntent)[keyof typeof EventsActionIntent], Fetcher[]> = {
    [EventsActionIntent.createEvent]: [],
    [EventsActionIntent.updateEvent]: [],
    [EventsActionIntent.getDistanceInfo]: []
  };

  fetchers.forEach(fetcher => {
    if (fetcher.state === "idle" || fetcher.state === "loading") {
      if ("intent" in fetcher.data && isValidIntent(fetcher.data.intent)) {
        const intentArr = result[fetcher.data.intent];
        result[fetcher.data.intent] = intentArr ? intentArr.concat(fetcher) : [fetcher];
      }
    }
  });
  return result;
}
