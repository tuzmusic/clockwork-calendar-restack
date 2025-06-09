import { EventRowJson } from "~/data/models/EventRow";

export type EventFilter = (
  row: EventRowJson,
  allRows: EventRowJson[]
) => boolean

export const FILTERS = {
  // this || case is to show all gigs if none are new.
  // it would be better to somehow deactivate and disable a filter if there would be no results.
  "New Only": (row, allRows) => !row.googleGig || allRows.every(row => row.googleGig),
  "Without Distance Info Only": (row) => !row.appGig.distanceInfo
} satisfies Record<string, EventFilter>;

export type AvailableFilter = keyof typeof FILTERS

export const FILTER_NAMES = Object.keys(FILTERS) as Array<keyof typeof FILTERS>;
