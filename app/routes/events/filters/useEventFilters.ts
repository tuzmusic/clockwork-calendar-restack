import { useSearchParams } from "@remix-run/react";
import { useCallback } from "react";

import { EventRowJson } from "~/data/models/EventRow";

import { AvailableFilter, FILTERS } from "./filters";


const useToggleFilter = () => {
  const [params, setParams] = useSearchParams();
  return useCallback((key: AvailableFilter) => {
    const currentFilters = params.getAll("filter");
    const hasFilter = currentFilters.includes(key);

    const newFilters = hasFilter
      ? currentFilters.filter(f => f !== key)
      : [...currentFilters, key];

    const newParams = new URLSearchParams(params);
    newParams.delete("filter"); // clear existing filters
    newFilters.forEach(f => newParams.append("filter", f)); // re-add filtered ones

    setParams(newParams);
  }, [params, setParams]);
};

export function useEventFilters(rows: EventRowJson[]) {
  const [params] = useSearchParams();
  const toggleFilter = useToggleFilter()

  const filters = params.getAll("filter") as AvailableFilter[];
  const alwaysShow = params.getAll("alwaysShow");

  const filteredEvents = !filters.length
    ? rows
    : rows?.filter(row =>
      filters.reduce((yet, filter) => {
        if (alwaysShow.includes(row.id)) return true;
        return yet && FILTERS[filter as AvailableFilter](row, rows);
      }, true)
    );

  return { toggleFilter, filteredEvents, filters };
}
