import type { Fetcher } from "@remix-run/react";
import { useFetchers } from "@remix-run/react";
import { renderHook } from "@testing-library/react";
import { mock } from "vitest-mock-extended";


import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

import { useEventRouteFetchers } from "./useEventRouteFetchers";

vi.mock("@remix-run/react");

describe("useEventRouteFetchers", () => {
  describe("fetchers idle", () => {
    it("returns the data from all the fetchers present, keyed by intent", () => {
      const fetcherCreate = {
        ...(mock<Fetcher>({ state: "idle", data: { intent: EventsActionIntent.createEvent } })),
        key: "a"
      };
      vi.mocked(useFetchers).mockReturnValueOnce([fetcherCreate]);

      const { result } = renderHook(() => useEventRouteFetchers());
      expect(result.current[EventsActionIntent.createEvent]).toEqual(fetcherCreate);
      expect(result.current[EventsActionIntent.updateEvent]).toBeNull()
      expect(result.current[EventsActionIntent.getDistanceInfo]).toBeNull()
    });
  });
});
