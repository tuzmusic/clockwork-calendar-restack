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
  describe.each(["idle", "loading"] as const)("fetchers %s", (state) => {
    it("returns the data from all the fetchers present, keyed by intent", () => {
      const fetcherCreate = {
        ...(mock<Fetcher>({ state, data: { intent: EventsActionIntent.createEvent } })),
        key: "a"
      };
      vi.mocked(useFetchers).mockReturnValueOnce([fetcherCreate]);

      const { result } = renderHook(() => useEventRouteFetchers());
      expect(result.current[EventsActionIntent.createEvent]).toEqual([fetcherCreate]);
      expect(result.current[EventsActionIntent.updateEvent]).toEqual([]);
      expect(result.current[EventsActionIntent.getDistanceInfo]).toEqual([]);
    });

    it("handles multiple fetchers per intent", () => {
      const fetcherUpdate1 = {
        ...(mock<Fetcher>({ state: "idle", data: { intent: EventsActionIntent.updateEvent, id: "01-02-2023" } })),
        key: "a"
      };
      const fetcherUpdate2 = {
        ...(mock<Fetcher>({ state: "idle", data: { intent: EventsActionIntent.updateEvent, id: "02-02-2023" } })),
        key: "b"
      };
      const twoFetchers = [fetcherUpdate1, fetcherUpdate2];
      vi.mocked(useFetchers).mockReturnValueOnce(twoFetchers);

      const { result } = renderHook(() => useEventRouteFetchers());
      expect(result.current[EventsActionIntent.updateEvent]).toEqual(twoFetchers);
      expect(result.current[EventsActionIntent.createEvent]).toEqual([]);
      expect(result.current[EventsActionIntent.getDistanceInfo]).toEqual([]);
    });
  });

  describe("fetchers submitting", () => {
    it("returns the form data from the fetchers present", () => {
      const formData = new FormData();
      formData.set("intent", EventsActionIntent.getDistanceInfo);
      formData.set("gig", JSON.stringify({ id: "01-02-2023" }));

      const fetcherDistance = {
        ...(mock<Fetcher>({ state: "submitting", formData })),
        key: "a"
      };
      vi.mocked(useFetchers).mockReturnValueOnce([fetcherDistance]);
      const { result } = renderHook(() => useEventRouteFetchers());
      expect(result.current[EventsActionIntent.createEvent]).toEqual([]);
      expect(result.current[EventsActionIntent.updateEvent]).toEqual([]);
      expect(result.current[EventsActionIntent.getDistanceInfo]).toEqual([fetcherDistance]);
    });
  });
});
