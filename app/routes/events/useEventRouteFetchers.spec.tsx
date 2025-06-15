import type { Fetcher } from "@remix-run/react";
import { useFetchers } from "@remix-run/react";
import { renderHook } from "@testing-library/react";
import { mock } from "vitest-mock-extended";


import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

import { useEventRouteFetchers } from "./useEventRouteFetchers";

vi.mock("@remix-run/react");

describe("useEventRouteFetchers", () => {
  describe("no fetchers", () => {
    it("returns empty arrays for each key when no fetchers are active", () => {
      vi.mocked(useFetchers).mockReturnValueOnce([]);
      const { result } = renderHook(() => useEventRouteFetchers());
      expect(result.current[EventsActionIntent.createEvent]).toEqual([]);
      expect(result.current[EventsActionIntent.updateEvent]).toEqual([]);
      expect(result.current[EventsActionIntent.getDistanceInfo]).toEqual([]);
    });
  });
  describe("fetchers idle", () => {
    it("returns the data from all the fetchers present, keyed by intent", () => {
      const fetcherCreate = {
        ...(mock<Fetcher>({ state: "idle", data: { intent: EventsActionIntent.createEvent } })),
        key: "a"
      };
      vi.mocked(useFetchers).mockReturnValueOnce([fetcherCreate]);

      const { result } = renderHook(() => useEventRouteFetchers());
      expect(result.current[EventsActionIntent.createEvent]).toEqual([fetcherCreate]);
      expect(result.current[EventsActionIntent.updateEvent]).toEqual([])
      expect(result.current[EventsActionIntent.getDistanceInfo]).toEqual([])
    });
  });
});
