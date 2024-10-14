import { AvailableFilter, FILTER_NAMES } from "~/routes/events/filters/useEventFilters";

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
