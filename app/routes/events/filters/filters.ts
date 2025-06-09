import { EventRowJson } from "~/data/models/EventRow";

export type EventFilter = (
  row: EventRowJson,
  allRows: EventRowJson[]
) => boolean
export const FILTERS = {
  "New Only": (row, _) => !row.googleGig
} satisfies Record<string, EventFilter>;

export type AvailableFilter = keyof typeof FILTERS

export const FILTER_NAMES = Object.keys(FILTERS) as Array<keyof typeof FILTERS>;
