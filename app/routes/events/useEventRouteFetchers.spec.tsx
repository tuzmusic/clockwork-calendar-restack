import * as Remix from "@remix-run/react";
import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { EventsActionIntent } from "~/routes/events/EventsActionIntent";

// Create a mock context provider
const MockRouterProvider = ({
  router,
  children
}: {
  router: ReturnType<typeof createMemoryRouter>;
  children: ReactNode;
}) => {
  return <RouterProvider router={router}>{children}</RouterProvider>;
};



describe("useEventRouteFetchers", () => {
  describe("all fetchers idle", () => {
    it("returns the data from all the fetchers, keyed by intent", () => {
      // const router = createMemoryRouter([
      //   {
      //     path: "*",
      //     element: ({ children }: { children: ReactNode }) => {
      //       return <>{children}</>;
      //     }
      //   }
      // ]);
      //
      // const { result } = renderHook(() => useEventRouteFetchers(), {
      //   wrapper: ({ children }) => (
      //     <MockRouterProvider router={router}>{children}</MockRouterProvider>
      //   )
      // });
      //
      // expect(result.current).toEqual([]);
      vi.spyOn(Remix, "useFetchers").mockReturnValueOnce([
        { state: "idle", data: {intent: EventsActionIntent.createEvent} }
      ] satisfies Fetcher[]);

      const { result } = renderHook(() => useEventRouteFetchers())
      console.log(result);
    });
  });
});
