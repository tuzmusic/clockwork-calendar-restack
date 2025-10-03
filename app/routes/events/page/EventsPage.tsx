import { useFetcher } from "@remix-run/react";
import { useMemo } from "react";

import { EventRowJson } from "~/data/models/EventRow";
import { EventsTable } from "~/routes/events/components/EventsTable";
import { EventsActionIntent } from "~/routes/events/EventsActionIntent";
import { FiltersUI } from "~/routes/events/filters/FiltersUI";
import { useEventFilters } from "~/routes/events/filters/useEventFilters";

export function EventsPage({ eventRows }: { eventRows: EventRowJson[] }) {
  const { toggleFilter, filters, filteredEvents } = useEventFilters(eventRows);
  const newEvents = useMemo(
    () => eventRows.filter((row) => !row.googleGig),
    []
  );
  const emailEventsCount = eventRows.filter((rows) => rows.emailGig).length;

  const getAllDistanceInfoFetcher = useFetcher();

  const { Form } = getAllDistanceInfoFetcher;

  return (
    <div className={"p-4 flex flex-col gap-4"}>
      <div>
        <div>
          <p>Found {emailEventsCount} events in the latest email.</p>
          <p>New events: {newEvents.length}</p>
          <Form method={"post"}>
            <button type="submit" className="underline text-blue-700">
              Load all missing distance info
            </button>
            <input type="hidden" name="intent" value={EventsActionIntent.getAllDistanceInfo} />
          </Form>
        </div>


        <FiltersUI filters={filters} toggleFilter={toggleFilter} />
      </div>
      <div className="flex flex-col gap-4">
        <EventsTable eventRows={filteredEvents} />
      </div>
    </div>
  );
}
