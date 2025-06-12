import { useSearchParams } from "@remix-run/react";

import { EventRowJson } from "~/data/models/EventRow";

import { AvailableFilter, FILTERS } from "./filters";

export function useEventFilters(rows: EventRowJson[]) {
  const [params, setParams] = useSearchParams();
  const filters = params.getAll("filter") as AvailableFilter[];

  const toggleFilter = (key: AvailableFilter) => {
    const currentFilters = params.getAll("filter");
    const hasFilter = currentFilters.includes(key);

    const newFilters = hasFilter
      ? currentFilters.filter(f => f !== key)
      : [...currentFilters, key];

    const newParams = new URLSearchParams(params);
    newParams.delete("filter"); // clear existing filters
    newFilters.forEach(f => newParams.append("filter", f)); // re-add filtered ones

    setParams(newParams);
  };

  const filteredEvents = !filters.length
    ? rows
    : rows?.filter(row =>
      filters.reduce((yet, filter) => yet && FILTERS[filter as AvailableFilter](row, rows), true)
    );

  return { toggleFilter, filteredEvents, filters };
}
