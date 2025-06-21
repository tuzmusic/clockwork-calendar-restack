import { useSearchParams } from "@remix-run/react";
import { useCallback } from "react";

import { EventRowJson } from "~/data/models/EventRow";

import { AvailableFilter, FILTERS } from "./filters";


const useToggleParamValue = (key: string) => {
  const [params, setParams] = useSearchParams();
  return useCallback((value: AvailableFilter) => {
    const currentValues = params.getAll(key);
    const hasValue = currentValues.includes(value);

    const newValues = hasValue
      ? currentValues.filter(f => f !== value)
      : [...currentValues, value];

    const newParams = new URLSearchParams(params);
    newParams.delete(key); // clear existing values
    newValues.forEach(val => newParams.append(key, val)); // re-add filtered ones

    setParams(newParams);
  }, [key, params, setParams]);
};

export function useEventFilters(rows: EventRowJson[]) {
  const toggleFilter = useToggleParamValue('filter')

  const [params] = useSearchParams();
  const filters = params.getAll("filter") as AvailableFilter[];
  const alwaysShow = params.getAll("alwaysShow");

  const filteredEvents = !filters.length
    ? rows
    : rows.filter(row =>
      filters.reduce((yet, filter) => {
        if (alwaysShow.includes(row.id)) return true;
        return yet && FILTERS[filter as AvailableFilter](row, rows);
      }, true)
    );

  return { toggleFilter, filteredEvents, filters };
}
