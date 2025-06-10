import { useSearchParams } from "@remix-run/react";

import { EventRowJson } from "~/data/models/EventRow";

import { AvailableFilter, FILTERS } from "./filters";

export function useEventFilters(rows: EventRowJson[]) {
  const [params, setParams] = useSearchParams()
  const filters = params.getAll('filter')

  // const [filters, setFilters] = useState<AvailableFilter[]>([
  //   // "New Only"
  // ]);

  const toggleFilter = (key: AvailableFilter) => {
    const newFilters = filters?.includes(key) ? filters.filter(f => f !== key) : [...filters, key];
    // setFilters(newFilters);
  };

  const filteredEvents = !filters.length
    ? rows
    : rows?.filter(row =>
      filters.reduce((yet, filter) => yet && FILTERS[filter](row, rows), true)
    );

  return { toggleFilter, filteredEvents, filters };
}
