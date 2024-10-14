import { EventRowJson } from "~/data/models/EventRow";

type EventFilter = (
  row: EventRowJson,
  allRows: EventRowJson[]
) => boolean

export const FILTERS = {
  "New Only": (row) => !row.googleGig
} satisfies Record<string, EventFilter>;

export type AvailableFilter = keyof typeof FILTERS

const FILTER_NAMES = Object.keys(FILTERS) as Array<keyof typeof FILTERS>;

export function Filters({ filters, toggleFilter }: {
  filters: AvailableFilter[]
  toggleFilter: (key: AvailableFilter) => void
}) {
  return (
    <div>
      <h3> Filter: </h3>
      <ul style={{ display: "flex", listStyle: "none", paddingInlineStart: 0 }}>
        {FILTER_NAMES.map((filterName) => (
          <li key={filterName}>
            <input
              id={filterName}
              type="checkbox"
              checked={filters.includes(filterName as AvailableFilter)}
              onChange={() => {
                toggleFilter(filterName as AvailableFilter);
              }}
            />
            <label>{filterName}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
