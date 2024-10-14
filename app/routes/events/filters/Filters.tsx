import { AvailableFilter, FILTER_NAMES } from "~/routes/events/filters/useEventFilters";

export function Filters({ filters, toggleFilter }: {
  filters: AvailableFilter[]
  toggleFilter: (key: AvailableFilter) => void
}) {
  return (
    <div className="flex gap-2">
      <h3> Filter: </h3>
      <ul>
        {FILTER_NAMES.map((filterName) => (
          <li className="flex gap-1" key={filterName}>
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
