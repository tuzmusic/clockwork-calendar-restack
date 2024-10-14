import { EventRowJson } from "~/data/models/EventRow";
import { EventsTable } from "~/routes/events/components/EventsTable";
import { Filters } from "~/routes/events/filters/Filters";
import { useEventFilters } from "~/routes/events/filters/useEventFilters";

export function EventsPage({ eventRows }: { eventRows: EventRowJson[] }) {
  const { toggleFilter, filters, filteredEvents } = useEventFilters(eventRows);
  return (
    <div>
      <Filters filters={filters} toggleFilter={toggleFilter} />
      <EventsTable eventRows={filteredEvents} />
    </div>
  );
}
