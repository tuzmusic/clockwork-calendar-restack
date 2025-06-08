import { useState } from "react";

import { EventRowJson } from "~/data/models/EventRow";

type EventFilter = (
  row: EventRowJson,
  allRows: EventRowJson[]
) => boolean

export const FILTERS = {
  "New Only": (row, _) => !row.googleGig
} satisfies Record<string, EventFilter>;

export type AvailableFilter = keyof typeof FILTERS

export const FILTER_NAMES = Object.keys(FILTERS) as Array<keyof typeof FILTERS>;

export function useEventFilters(rows: EventRowJson[]) {
  const [filters, setFilters] = useState<AvailableFilter[]>([
    // "New Only"
  ]);

  const toggleFilter = (key: AvailableFilter) => {
    const newFilters = filters?.includes(key) ? filters.filter(f => f !== key) : [...filters, key];
    setFilters(newFilters);
  };

  const filteredEvents = !filters.length
    ? rows
    : rows?.filter(row =>
      filters.reduce((yet, filter) => yet && FILTERS[filter](row, rows), true)
    );

  return { toggleFilter, filteredEvents, filters };
}
